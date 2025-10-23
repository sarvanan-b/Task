import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { IoMdClose } from "react-icons/io";
import PropTypes from "prop-types";

const AssetPreview = ({ isOpen, onClose, asset, taskId }) => {
  if (!asset) return null;

  const API_URI = import.meta.env.VITE_APP_BASE_URL || "http://localhost:8800";
  const previewUrl = `${API_URI}/api/task/${taskId}/assets/${asset._id}/download`;

  const isImage = asset.mimetype.includes('image');
  const isPdf = asset.mimetype.includes('pdf');

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between p-4 border-b">
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                    {asset.originalName}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <IoMdClose className="text-2xl" />
                  </button>
                </div>

                <div className="p-4">
                  {isImage ? (
                    <div className="flex justify-center">
                      <img
                        src={previewUrl}
                        alt={asset.originalName}
                        className="max-w-full max-h-96 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div style={{ display: 'none' }} className="text-center p-8">
                        <p className="text-gray-500">Unable to preview this image</p>
                        <a
                          href={previewUrl}
                          download={asset.originalName}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Download instead
                        </a>
                      </div>
                    </div>
                  ) : isPdf ? (
                    <div className="w-full h-96">
                      <iframe
                        src={previewUrl}
                        className="w-full h-full border-0"
                        title={asset.originalName}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                      <div style={{ display: 'none' }} className="text-center p-8">
                        <p className="text-gray-500">Unable to preview this PDF</p>
                        <a
                          href={previewUrl}
                          download={asset.originalName}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Download instead
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <div className="text-6xl mb-4">
                        {asset.mimetype.includes('word') ? '📝' :
                         asset.mimetype.includes('excel') || asset.mimetype.includes('spreadsheet') ? '📊' :
                         asset.mimetype.includes('powerpoint') || asset.mimetype.includes('presentation') ? '📽️' :
                         '📄'}
                      </div>
                      <p className="text-gray-500 mb-4">
                        Preview not available for this file type
                      </p>
                      <a
                        href={previewUrl}
                        download={asset.originalName}
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Download File
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex justify-end p-4 border-t bg-gray-50">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Close
                  </button>
                  <a
                    href={previewUrl}
                    download={asset.originalName}
                    className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Download
                  </a>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

AssetPreview.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  asset: PropTypes.object,
  taskId: PropTypes.string.isRequired,
};

export default AssetPreview;
