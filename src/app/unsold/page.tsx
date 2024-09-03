"use client";

import React, { useEffect, useState } from "react";

type Player = {
  name: string;
  Position: string;
  avatar: string;
};

const UnsoldPlayersList = () => {
  const [unsoldPlayers, setUnsoldPlayers] = useState<Player[]>([]);

  useEffect(() => {
    // Load unsold players from localStorage
    const savedUnsoldPlayers = localStorage.getItem('unsoldPlayers');
    if (savedUnsoldPlayers) {
      setUnsoldPlayers(JSON.parse(savedUnsoldPlayers));
    }
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-6 p-6 bg-gray-900 min-h-screen">
      {unsoldPlayers.length === 0 ? (
        <p className="text-white">No unsold players available.</p>
      ) : (
        unsoldPlayers.map((player) => (
          <div key={player.name} className="bg-gray-800 shadow-lg rounded-lg overflow-hidden w-60 p-4">
            <div className="flex justify-center">
              <img
                className="w-32 h-32 object-cover rounded-full border-4 border-gray-700"
                src={player.avatar}
                alt={player.name}
              />
            </div>
            <div className="text-center mt-4">
              <h2 className="text-xl font-semibold text-white">{player.name}</h2>
              <p className="text-gray-400">{player.Position}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UnsoldPlayersList;
