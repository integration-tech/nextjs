import { useState } from "react";
import Link from "next/link";

const Modal = ({ isOpen, onClose }:any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 rounded-2xl flex justify-center items-center z-50">
      <div className="backdrop-blur-xl p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Auction Finished</h2>
        <p className="mb-6">See you on 11th September!</p>
        <Link href="/">
          <div className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
            Go to Home
          </div>
        </Link>
        <button
          onClick={onClose}
          className="mt-4 text-white hover:text-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
