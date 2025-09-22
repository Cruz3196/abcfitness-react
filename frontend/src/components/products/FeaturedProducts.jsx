const FeaturedProducts = () => {
    return (
        <div className="container mx-auto">
            <div className="text-center my-8">
                <h2 className="text-3xl font-bold">Our Featured Products</h2>
                <p className="text-gray-600 mt-6">Explore our diverse range of products across various categories.</p>
                <button className="btn justify-center mt-7">Shop Now</button>
            </div>
            
            {/*  displaying the 3 cards horizontally centered */}
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 place-items-center mt-auto">
                {/* card 1  */}
                <div className="card my-5 lg:w-80 xl:w-96 bg-base-100 shadow-xl">
                    <figure><img src="/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
                        <div className="card-body">
                            <h2 className="card-title">Shoes!</h2>
                            <p>If a dog chews shoes whose shoes does he choose?</p>
                            <div className="card-actions justify-end">
                            <button className="btn btn-primary">Buy Now</button>
                            </div>
                        </div>
                </div>
                {/* card 2  */}
                <div className="card my-5 lg:w-80 xl:w-96 bg-base-100 shadow-xl">
                    <figure><img src="/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
                        <div className="card-body">
                            <h2 className="card-title">Shoes!</h2>
                            <p>If a dog chews shoes whose shoes does he choose?</p>
                            <div className="card-actions justify-end">
                            <button className="btn btn-primary">Buy Now</button>
                            </div>
                        </div>
                </div>
                {/* card 3  */}
                <div className="card my-5 lg:w-80 xl:w-96 bg-base-100 shadow-xl">
                    <figure><img src="/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
                        <div className="card-body">
                            <h2 className="card-title">Shoes!</h2>
                            <p>If a dog chews shoes whose shoes does he choose?</p>
                            <div className="card-actions justify-end">
                            <button className="btn btn-primary">Buy Now</button>
                            </div>
                        </div>
                </div>
            </div>

        </div>
    )
}

export default FeaturedProducts;