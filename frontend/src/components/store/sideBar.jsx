const CategorySidebar = ({
  categories,
  selectedCategories,
  onCategoryChange,
}) => {
  return (
    <aside className="w-full md:w-48 flex-shrink-0">
      <div className="sticky top-20">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium">Categories</h2>
          {selectedCategories.length > 0 && (
            <button
              onClick={() => onCategoryChange("__CLEAR__")}
              className="text-xs text-primary hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="space-y-1">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-2 py-1 cursor-pointer hover:text-primary transition-colors"
            >
              <input
                type="checkbox"
                className="checkbox checkbox-xs checkbox-primary"
                checked={selectedCategories.includes(category)}
                onChange={() => onCategoryChange(category)}
              />
              <span className="text-sm capitalize">{category}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default CategorySidebar;
