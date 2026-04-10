
import StandardComboBox from './StandardComboBox';

function FormLayout() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form action="#" method="POST" className="mx-auto max-w-md md:max-w-2xl w-full" onSubmit={handleSubmit}>
      {/* Container con flex y gap */}
      <div className='flex flex-col gap-6'>
        <StandardComboBox />
        <StandardComboBox />
        <StandardComboBox />
     
      </div>

      {/* Submit Button */}
      <div className="mt-10">
        <button
         style={{backgroundColor:"#45d2fd"}}
          type="submit"
          className="block w-full rounded-md bg-blue-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors"
        >
          Let's talk
        </button>
      </div>
    </form>
  );
}

export default FormLayout;
