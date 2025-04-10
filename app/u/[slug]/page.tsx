import { db } from "@/database/firebase";
import { doc, getDoc } from "firebase/firestore";

export default async function UserHomePage({ params }: { params: { slug: string } }) {
  const userRef = doc(db, "users", params.slug); // assuming doc ID is slug (or you can query by slug)
  const userSnap = await getDoc(userRef);

  const username = userSnap.exists() ? userSnap.data().username : "User";

  return (
    <div className="text-white p-4">
      <h1 className="text-2xl font-bold">Welcome, {username}</h1>
    </div>
  );
}
