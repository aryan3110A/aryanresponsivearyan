import CategorySections from "./components/Categorysections";
import FeaturedArticles from "./components/FeaturedArticles";
import FollowSection from "./components/Follow";
import Header from "./components/header";



export default function Blog() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-black text-white font-poppins">
      <Header />

      {/* Main Content */}
      <main className="mt-20 pt-10 font-poppins">
        <FeaturedArticles/>
        <CategorySections />
        <FollowSection />
      </main>
    </div>
  )
}

