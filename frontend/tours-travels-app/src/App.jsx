import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";

const Navbar = () => (
  <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
    <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
      <h1 className="text-2xl font-bold text-blue-600">WanderLux</h1>
      <div className="space-x-6">
        {[
          "Home",
          "Promotions",
          "Destinations",
          "Star Packages",
          "Brands",
          "Corporate",
          "Services",
          "About Us",
        ].map((item) => (
          <Link
            key={item}
            to={item === "Home" ? "/" : `/${item.toLowerCase().replace(/ /g, "-")}`}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition"
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  </nav>
);

const Home = () => (
  <div className="relative flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6"
    >
      Discover Your Next Journey
    </motion.h2>
    <p className="max-w-2xl text-lg text-slate-600 mb-8">
      Premium tour packages, hand‑crafted experiences, and seamless travel planning.
    </p>
    <Button asChild className="px-8 py-4 text-lg rounded-full shadow-lg">
      <Link to="/star-packages">Explore Packages</Link>
    </Button>
  </div>
);

const packages = [
  {
    title: "Bali Escape",
    duration: "6 Days / 5 Nights",
    price: "₹89,999",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    addons: ["Scuba Diving", "Private Villa", "Sunset Cruise"],
  },
  {
    title: "Swiss Alps Adventure",
    duration: "8 Days / 7 Nights",
    price: "₹1,89,999",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    addons: ["Jungfrau Pass", "Luxury Train", "Paragliding"],
  },
  {
    title: "Dubai Luxury Tour",
    duration: "5 Days / 4 Nights",
    price: "₹79,999",
    image: "https://images.unsplash.com/photo-1498496294664-d9372eb521f3",
    addons: ["Desert Safari", "Burj Khalifa Lounge", "Yacht Party"],
  },
];

const PackagesPage = () => (
  <div className="px-8 py-12">
    <h2 className="text-4xl font-bold mb-10 text-center">Star Packages</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {packages.map((pkg) => (
        <motion.div whileHover={{ scale: 1.03 }} key={pkg.title}>
          <Card className="overflow-hidden rounded-2xl shadow-lg">
            <img src={pkg.image} alt={pkg.title} className="h-48 w-full object-cover" />
            <CardContent className="p-6">
              <h3 className="text-2xl font-semibold mb-1">{pkg.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{pkg.duration}</p>
              <p className="text-xl font-bold text-blue-600 mb-4">{pkg.price}</p>
              <div className="mb-4">
                <p className="font-medium">Add‑ons:</p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {pkg.addons.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
              <Button className="w-full">Book Now</Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </div>
);

const Placeholder = ({ title }) => (
  <div className="flex items-center justify-center h-[60vh]">
    <h2 className="text-3xl font-semibold text-gray-500">{title} – Coming Soon</h2>
  </div>
);

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/promotions" element={<Placeholder title="Promotions" />} />
        <Route path="/destinations" element={<Placeholder title="Destinations" />} />
        <Route path="/star-packages" element={<PackagesPage />} />
        <Route path="/brands" element={<Placeholder title="Brands" />} />
        <Route path="/corporate" element={<Placeholder title="Corporate" />} />
        <Route path="/services" element={<Placeholder title="Services" />} />
        <Route path="/about-us" element={<Placeholder title="About Us" />} />
      </Routes>
    </Router>
  );
}
