export interface Partner {
    name: string
    logo: string
  }
  
  export const partners: Partner[] = [
    {
      name: "Google Cloud",
      logo: "/google_cloud.png",
    },
    {
      name: "Wildchild Studios",
      logo: "/Wildchild.png",
    },
    {
      name: "MI AI",
      logo: "/MistralAi.png",
    }, 
    {
      name: "MI AI",
      logo: "/Hugging_Face.png",
    }, 
    // Duplicate partners to create infinite scroll effect
    {
        name: "Google Cloud",
        logo: "/google_cloud.png",
      },
      {
        name: "Wildchild Studios",
        logo: "/Wildchild.png",
      },
      {
        name: "MI AI",
        logo: "/MistralAi.png",
      },
      {
        name: "MI AI",
        logo: "/Hugging_Face.png",
      }, 
  ]
  
      