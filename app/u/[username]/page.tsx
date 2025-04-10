import { db } from "@/database/firebase";
import { doc, getDoc } from "firebase/firestore";

export default async function UserProfilePage({ params }) {
  const { slug } = params;

  const userSnapshot = await getDoc(doc(db, "users", slug));
  if (!userSnapshot.exists()) {
    return <div className="text-white p-6">User not found</div>;
  }

  const userData = userSnapshot.data();

  return (
    <div className="text-white p-10">
      <h1>Welcome, {userData.username}</h1>
      <p>Email: {userData.email}</p>
    </div>
  );
}
