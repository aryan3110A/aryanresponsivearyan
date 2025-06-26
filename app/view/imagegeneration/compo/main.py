#!/usr/bin/env python3
"""
Multi-GPU Stable-Diffusion-3.5 backend
  • One pipeline per GPU (0-7) is kept resident in VRAM.
  • Every incoming request is routed to the next GPU in round-robin order.
  • Generation itself is executed in a thread-pool so FastAPI stays non-blocking.
Run with:
    CUDA_VISIBLE_DEVICES=0,1,2,3,4,5,6,7 \
    python3 -m uvicorn sd_multigpu:app --host 0.0.0.0 --port 7900 --workers 1
(keep workers = 1; we already use the eight GPUs internally)
"""

import os, itertools, asyncio
from functools import partial
from uuid import uuid4

import torch
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from starlette.concurrency import run_in_threadpool
from diffusers import SD3Transformer2DModel, StableDiffusion3Pipeline

# ─────────────────────────── Config ────────────────────────────
MODEL_ID   = "stabilityai/stable-diffusion-3.5-medium"
API_KEY    = "wildmind_5879fcd4a8b94743b3a7c8c1a1b4"
GPU_IDS    = [0, 1, 2, 3, 4, 5, 6, 7]                # 8× H200
OUT_DIR    = os.path.join(os.path.dirname(__file__), "generated")
os.makedirs(OUT_DIR, exist_ok=True)

# ─────────────────── Load one pipeline per GPU ─────────────────
print("🔄  Loading SD-3.5-medium onto all GPUs …")
pipes = {}
for g in GPU_IDS:
    print(f"  • cuda:{g}  (loading…)")
    torch.cuda.set_device(g)
    trans = SD3Transformer2DModel.from_pretrained(
        MODEL_ID, subfolder="transformer", torch_dtype=torch.float16
    ).to(f"cuda:{g}")

    pipe  = StableDiffusion3Pipeline.from_pretrained(
        MODEL_ID, transformer=trans, torch_dtype=torch.float16
    ).to(f"cuda:{g}")
    pipes[g] = pipe
print("✅  All pipelines ready!")

gpu_cycle = itertools.cycle(GPU_IDS)      # round-robin iterator

# ───────────────────────── FastAPI app ─────────────────────────
app = FastAPI(title="SD-3.5 multi-GPU")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.wildmindai.com", "https://api.wildmindai.com"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

app.mount("/images", StaticFiles(directory=OUT_DIR), name="images")

class PromptIn(BaseModel):
    prompt: str
    steps:  int  = 50
    scale:  float = 5.5
    width:  int = 768
    height: int = 768

# ─────────────────── Helper: render on one GPU ─────────────────
def _render_on(gpu: int, prompt: str, steps: int, scale: float, fname: str, width: int, height: int):
    torch.cuda.set_device(gpu)
    pipe = pipes[gpu]
    img  = pipe(prompt, num_inference_steps=steps,
                guidance_scale=scale, width=width, height=height).images[0]
    img.save(fname)

# ───────────────────────── main endpoint ───────────────────────
@app.post("/generate")
async def generate(req: Request, body: PromptIn):
    # auth
    if req.headers.get("x-api-key") != API_KEY:
        raise HTTPException(401, "bad api key")

    prompt = body.prompt.strip()
    if not prompt:
        raise HTTPException(400, "empty prompt")

    # choose GPU
    gpu = next(gpu_cycle)

    # output file
    fname = os.path.join(OUT_DIR, f"{uuid4().hex}.png")

    # off-load to thread so event-loop is free
    await run_in_threadpool(
        partial(_render_on, gpu, prompt, body.steps, body.scale, fname, body.width, body.height)
    )

    return {"image_url": f"https://api.wildmindai.com/images/{os.path.basename(fname)}"}

# ───────────────────────── health-check ────────────────────────
@app.get("/ping")
def ping(): return {"status": "ok"}