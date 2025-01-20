import { useState } from "react";
import { UploadComponent } from "./Components/UploadComponent";
import axios from "axios";

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (file) => {
    setUploadedFile(file); // Set the uploaded file to state
    console.log("Uploaded File:", file); // Optional: Log the uploaded file to the console
  };

  const handleProcessImage = async () => {
    if (!uploadedFile) return;

    setLoading(true);
    setResponse(""); // Clear previous response
    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const result = await axios.post(
        "https://ocr-tf-js-1.onrender.com/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResponse(result.data); // Assume your backend returns a string or object
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error processing image:", error);
      setResponse("Failed to process the image. Please try again.");
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="p-4 border-b border-gray-700 flex justify-center">
        <h1 className="text-2xl font-bold">Upload your document</h1>
      </header>
      <div className="flex flex-col items-center justify-center mt-12">
        <UploadComponent onFileUpload={handleFileUpload} />
        {/* Conditionally render the uploaded image below the UploadComponent */}
        {uploadedFile && (
          <div className="mt-6 w-full max-w-xl p-4 bg-gray-800 rounded-lg border border-gray-700 flex flex-col items-center space-y-4">
            <p className="text-white">{uploadedFile.name}</p>
            <button
              onClick={handleProcessImage}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
            >
              {loading ? "Processing..." : "Process Image"}
            </button>
          </div>
        )}
      </div>

      {/* Modal for displaying the response */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Processed Image Output
            </h2>
            <div className="text-gray-700">
              {typeof response === "object" ? (
                <pre className="bg-gray-100 p-4 rounded-md text-sm">
                  {JSON.stringify(response, null, 2)}
                </pre>
              ) : (
                <p>{response}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
