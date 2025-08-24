'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function PostbackURL() {
  const searchParams = useSearchParams();
  const affiliateId = searchParams.get('affiliate_id');

  const postbackURL = `http://localhost:3001/postback?affiliate_id=${affiliateId}&click_id={click_id}&amount={amount}&currency={currency}`;

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(postbackURL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-white text-lg font-bold">Affiliate System</Link>
          <Link href={`/postback-url?affiliate_id=${affiliateId}`} className="text-gray-300 hover:text-white">Postback URL</Link>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Your Postback URL</h1>
          <p className="text-lg">Here is your unique postback URL:</p>
          <div className="bg-gray-100 p-4 rounded mt-2 flex items-center justify-between">
            <code className="text-sm overflow-x-auto">{postbackURL}</code>
            <button
              onClick={copyToClipboard}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="mt-4">Replace the placeholders with the actual values.</p>
        </div>
      </div>
    </div>
  );
}