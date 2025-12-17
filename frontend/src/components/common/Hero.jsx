import { Link } from "react-router-dom";
import HeroImage from "../../../assets/abcfitnesshero.jpg";

const Hero = () => {
  return (
    <div className="bg-base-200">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
              Transform Your Fitness Journey
            </h1>
            <p className="text-base-content/70 mb-6">
              Join ABC Fitness and discover a community dedicated to helping you
              achieve your health and wellness goals. Expert trainers,
              state-of-the-art equipment, and personalized programs await you.
            </p>
            <div className="flex gap-3">
              <Link to="/store" className="btn btn-primary">
                Shop Now
              </Link>
              <Link to="/classes" className="btn btn-outline">
                View Classes
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <img
              src={HeroImage}
              className="rounded-lg w-full h-auto max-h-[400px] object-cover"
              alt="ABC Fitness"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
