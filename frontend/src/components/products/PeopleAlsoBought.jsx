import ProductCard from "./ProductCard"
import { Link } from "react-router-dom"
import { useState, useRef } from "react"

const PeopleAlsoBought = ({ products, title, subtitle }) => {
    const carouselRef = useRef(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

    if(!products || products.length === 0) {
        return null
    }

    const checkScroll = () => {
        if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
        setCanScrollLeft(scrollLeft > 0)
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
        }
    }

    const scroll = (direction) => {
        if (carouselRef.current) {
        const scrollAmount = 300
        carouselRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        })
        setTimeout(checkScroll, 100)
        }
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center my-8">
                    <h2 className="text-3xl font-bold">{title}</h2>
                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto">{subtitle}</p>
                <Link to="/store">
                <button className="btn btn-primary mt-7">Shop Now</button>
                </Link>
            </div>
        
            {/* Carousel for mobile/tablet with navigation buttons */}
            <div className="relative lg:hidden">
                {/* Left Arrow */}
                <button 
                    onClick={() => scroll('left')}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 btn btn-circle btn-sm ${!canScrollLeft ? 'btn-disabled opacity-30' : 'btn-neutral'}`}
                    disabled={!canScrollLeft}
                    >
                    ❮
                </button>

                {/* Carousel */}
                <div 
                    ref={carouselRef}
                    onScroll={checkScroll}
                    className="carousel carousel-center w-full space-x-4 p-4 px-12"
                    >
                    {products.map((product) => (
                        <div key={product._id} className="carousel-item w-72">
                        <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                {/* Right Arrow */}
                <button 
                        onClick={() => scroll('right')}
                        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 btn btn-circle btn-sm ${!canScrollRight ? 'btn-disabled opacity-30' : 'btn-neutral'}`}
                        disabled={!canScrollRight}
                        >
                    ❯
                </button>

                {/* Scroll indicator dots */}
                <div className="flex justify-center gap-2 mt-4">
                {products.map((_, index) => (
                    <div 
                    key={index} 
                    className="w-2 h-2 rounded-full bg-base-300"
                    ></div>
                ))}
                </div>
            </div>

            {/* Grid for desktop */}
            <div className="hidden lg:grid lg:grid-cols-4 place-content-evenly gap-4">
                {products.map((product) => (
                <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    )
}

export default PeopleAlsoBought