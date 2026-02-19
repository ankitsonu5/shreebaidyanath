import Navbar from "./components/navbar";
import Footer from "./components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 sm:px-6 md:px-8 lg:px-12">
        <h1 className="text-center text-xl sm:text-2xl md:text-3xl font-bold mt-8 sm:mt-10">
          Welcome to Shree Baidyanath
        </h1>
      </main>
      <Footer />
    </>
  );
}