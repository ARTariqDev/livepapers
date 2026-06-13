import Navbar from './components/landingpage/Navbar';
import Hero from './components/landingpage/Hero';
import Features from './components/landingpage/Features';
import Footer from './components/landingpage/Footer';

export default function Home() {
  return (
    //AI was messing up code so I split it into components
    // makes it easier this way to manage code for me
    <main className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background font-sans overflow-hidden">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
