const CategorySidebar = ({ categories, selectedCategories, onCategoryChange }) => {
    return (
        <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
            <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                <h2 className="card-title border-b border-base-300 pb-2">
                    Categories
                </h2>
                <div className="form-control space-y-2">
                    {categories.map((category) => (
                    <label key={category} className="label cursor-pointer justify-start">
                        <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        checked={selectedCategories.includes(category)}
                        onChange={() => onCategoryChange(category)}
                        />
                        <span className="label-text ml-3 capitalize">{category}</span>
                    </label>
                    ))}
                </div>
                {selectedCategories.length > 0 && (
                    <button
                    onClick={() => onCategoryChange('__CLEAR__')}
                    className="btn btn-ghost btn-xs mt-4"
                    >
                    Clear Filters
                    </button>
                )}
                </div>
            </div>
        </aside>
    );
};

export default CategorySidebar;

