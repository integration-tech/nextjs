"use client";

import React, { useEffect, useState } from "react";

type Player = {
  name: string;
  Position: string;
  avatar: string;
  soldAt?:number;
};

const SoldPlayersList = () => {
  const [soldPlayers, setSoldPlayers] = useState<Player[]>([]);

  useEffect(() => {
    // Load sold players from localStorage
    const savedSoldPlayers = localStorage.getItem('soldPlayers');
    if (savedSoldPlayers) {
      setSoldPlayers(JSON.parse(savedSoldPlayers));
    }
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-6 p-6 bg-gray-900 min-h-screen">
      {soldPlayers.length === 0 ? (
        <p className="text-white">No sold players available.</p>
      ) : (
        soldPlayers.map((player) => (
          <div key={player.name} className="bg-gray-800 shadow-lg rounded-lg overflow-hidden w-60 p-4">
            <div className="flex justify-center">
              <img
                className="w-32 h-32 object-cover rounded-full border-4 border-gray-700"
                src={player.avatar}
                alt={player.name}
              />
            </div>
            <div className="text-center mt-4">
              <h2 className="font-mono text-xl text-white">Sold At :{player.soldAt}</h2>
              <h2 className="text-xl font-semibold text-white">{player.name}</h2>
              <p className="text-gray-400">{player.Position}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SoldPlayersList;
