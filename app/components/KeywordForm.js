import { useState } from 'react';

function KeywordForm() {
  const [inputKeywords, setInputKeywords] = useState('');
  const [results, setResults] = useState([]);
  const [selectedText, setSelectedText] = useState(null); // State for the full text

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetchResults();
  };

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords: inputKeywords.split(',').map(keyword => keyword.trim()) })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('API Response:', data);

      // Process Reddit data to fit your table format
      const processedResults = data.data.children.map(child => ({
        keyword: inputKeywords.split(',').map(keyword => keyword.trim()).join(', '),
        title: child.data.title,
        selftext: child.data.selftext,
        author: child.data.author,
        subreddit: child.data.subreddit,
        url: `https://www.reddit.com${child.data.permalink}`
      }));

      setResults(processedResults);
    } catch (error) {
      console.error('Error fetching results:', error);
      setResults([]);
    }
  };

  const handleTextClick = (data) => {
    setSelectedText(data); // Set the entire data object for the modal
  };

  const closeModal = () => {
    setSelectedText(null); // Close the modal
  };

  console.log('Results:', results); // Debugging statement

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 transition-colors duration-300 ease-in">
      {/* Menu Bar */}
      <nav className="bg-gray-800 p-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">Listen Social</h1>
        </div>
      </nav>
    
      <div className="flex flex-1 transition-all duration-300 ease-in">
        {/* Form Section */}
        <div className="w-full lg:w-1/3 p-6 flex justify-center items-center">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700 w-full max-w-md">
            
            <h1 className="text-3xl font-bold mb-6 text-gray-200 text-center">Keyword Search</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Enter keywords separated by commas"
                value={inputKeywords}
                onChange={(e) => setInputKeywords(e.target.value)}
                required
                className="border border-gray-600 bg-gray-700 p-4 rounded-lg w-full text-gray-200 placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-400 focus:border-blue-400 transition-colors duration-300 ease-in"
              />
              <button
                type="submit"
                className="bg-blue-700 text-white p-4 rounded-lg w-full hover:bg-blue-800 transition-colors duration-300 ease-in"
              >
                Search
              </button>
            </form>
          </div>
        </div>
  
        {/* Results Section */}
        <div className="w-full lg:w-2/3 p-6 flex flex-col">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700 flex-1">
            <h2 className="text-2xl font-bold mb-6 text-gray-200">Search Results</h2>
            <div className="overflow-x-auto">
              <div className="overflow-y-auto max-h-[calc(100vh-14rem)]"> {/* Adjust max-height as needed */}
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Keyword</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Text</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Author</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Subreddit</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">URL</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {results.length > 0 ? (
                      results.map((result, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 text-sm text-gray-200">{result.keyword || "N/A"}</td>
                          <td className="px-6 py-4 text-sm text-gray-200">
                            <div className="max-w-xs h-12 overflow-hidden text-ellipsis">
                              {result.title || "N/A"}
                            </div>
                          </td>
                          <td
                            className="px-6 py-4 text-sm text-gray-200 cursor-pointer"
                            onClick={() =>
                              handleTextClick({
                                title: result.title,
                                author: result.author,
                                url: result.url,
                                selftext: result.selftext,
                              })
                            }
                          >
                            <div className="max-w-xs h-20 overflow-hidden text-ellipsis">
                              {result.selftext || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-200">
                            {result.author || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-200">
                            {result.subreddit || "N/A"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-200">
                            {result.url ? (
                              <a
                                href={result.url}
                                className="text-blue-400 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View Post
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-sm text-gray-200 text-center">
                          No results found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for displaying full data */}
      {selectedText && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg w-full max-w-4xl relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-200">Post Details</h2>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-300">Title:</h3>
                  <p className="text-gray-200">
                    {selectedText.title || "N/A"}
                  </p>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-300">Author:</h3>
                  <p className="text-gray-200">
                    {selectedText.author || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-300">Link:</h3>
                  <a
                    href={selectedText.url}
                    className="text-blue-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedText.url || "N/A"}
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-300">Full Text:</h3>
                <p className="text-gray-200">
                  {selectedText.selftext || "N/A"}
                </p>
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={closeModal}
                  className="bg-gray-700 text-white p-4 rounded-lg hover:bg-gray-600 transition-colors duration-300 ease-in"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KeywordForm;