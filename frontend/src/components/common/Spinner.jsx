// A simple, reusable loading spinner component using a pre-styled DaisyUI class.
// This is used throughout the application to indicate that a data-fetching
// operation is in progress, providing a good user experience.
const Spinner = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );
};

export default Spinner;

