'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [affiliateId, setAffiliateId] = useState(1);
  const [clicks, setClicks] = useState([]);
  const [conversions, setConversions] = useState([]);

  useEffect(() => {
    const fetchClicks = async () => {
      const res = await fetch(`/api/clicks?affiliate_id=${affiliateId}`);
      const data = await res.json();
      setClicks(Array.isArray(data) ? data : []);
    };

    const fetchConversions = async () => {
      const res = await fetch(`/api/conversions?affiliate_id=${affiliateId}`);
      const data = await res.json();
      setConversions(Array.isArray(data) ? data : []);
    };

    if (affiliateId) {
      fetchClicks();
      fetchConversions();
    }
  }, [affiliateId]);

  return (
    <div>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-white text-lg font-bold">Affiliate System</Link>
          <Link href={`/postback-url?affiliate_id=${affiliateId}`} className="text-gray-300 hover:text-white">Postback URL</Link>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <div className="mb-4">
          <label htmlFor="affiliate" className="mr-2">Select Affiliate:</label>
          <select
            id="affiliate"
            value={affiliateId}
            onChange={(e) => setAffiliateId(parseInt(e.target.value))}
            className="p-2 border rounded"
          >
            <option value={1}>Affiliate 1</option>
            <option value={2}>Affiliate 2</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Clicks</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border">
                <thead>
                  <tr>
                    <th className="border p-2">Campaign ID</th>
                    <th className="border p-2">Click ID</th>
                    <th className="border p-2">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {clicks.map((click: any) => (
                    <tr key={click.id}>
                      <td className="border p-2">{click.campaign_id}</td>
                      <td className="border p-2">{click.click_id}</td>
                      <td className="border p-2">{new Date(click.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Conversions</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border">
                <thead>
                  <tr>
                    <th className="border p-2">Amount</th>
                    <th className="border p-2">Currency</th>
                    <th className="border p-2">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {conversions.map((conversion: any) => (
                    <tr key={conversion.id}>
                      <td className="border p-2">{conversion.amount}</td>
                      <td className="border p-2">{conversion.currency}</td>
                      <td className="border p-2">{new Date(conversion.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
