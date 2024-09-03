"use client";

import React, { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { jsonData } from "../data";
import { Input } from "@/components/ui/input";

type Player = {
  name: string;
  Position: string;
  avatar: string;
  soldAt?: number; // Add soldAt to track the sold price
};

const Page = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [canGetNewPlayer, setCanGetNewPlayer] = useState(true);
  const [soldPlayers, setSoldPlayers] = useState<Player[]>([]);
  const [unsoldPlayers, setUnsoldPlayers] = useState<Player[]>([]);
  const [players, setPlayers] = useState<Record<string, Player[]>>({});
  const [price, setPrice] = useState(0); // State for managing the price

  const Positions = [
    "striker",
    "defender",
    "midfielder",
    "goalkeeper",
    "allRounder",
  ];

  useEffect(() => {
    const parsedPlayers: Record<string, Player[]> = {
      goalkeeper: [],
      striker: [],
      defender: [],
      midfielder: [],
      allRounder: [],
    };

    jsonData.forEach((item) => {
      const position = item["Position"].toLowerCase();
      const player: Player = {
        name: item["Name"] || "Unknown",
        Position: position,
        avatar: item["Photo"] || "https://robohash.org/default.png",
      };

      if (parsedPlayers[position]) {
        parsedPlayers[position].push(player);
      } else {
        parsedPlayers["allRounder"].push(player);
      }
    });

    localStorage.setItem("parsedPlayers", JSON.stringify(parsedPlayers));
    setPlayers(parsedPlayers);
  }, []);

  useEffect(() => {
    const savedSoldPlayers = localStorage.getItem("soldPlayers");
    const savedUnsoldPlayers = localStorage.getItem("unsoldPlayers");
    const savedPlayers = localStorage.getItem("parsedPlayers");

    if (savedSoldPlayers) {
      setSoldPlayers(JSON.parse(savedSoldPlayers));
    }
    if (savedUnsoldPlayers) {
      setUnsoldPlayers(JSON.parse(savedUnsoldPlayers));
    }
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("soldPlayers", JSON.stringify(soldPlayers));
    localStorage.setItem("unsoldPlayers", JSON.stringify(unsoldPlayers));
    localStorage.setItem("parsedPlayers", JSON.stringify(players));
  }, [soldPlayers, unsoldPlayers, players]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [counter, setCounter] = useState(0);

  const areAllPlayersEmpty = (): boolean => {
    return Positions.every((position) => players[position].length === 0);
  };

  const getRandom = (): Player | null => {
    let availablePlayerFound = false;
    let newCurrentIndex = currentIndex;
    let newCounter = counter;

    while (!availablePlayerFound) {
      const currentPosition = Positions[newCurrentIndex];
      const playersInCurrentPosition = players[currentPosition] || [];

      if (playersInCurrentPosition.length > 0) {
        availablePlayerFound = true;

        const randomIndex = Math.floor(
          Math.random() * playersInCurrentPosition.length
        );
        const selectedPlayer = playersInCurrentPosition[randomIndex];

        // Remove the selected player from the array
        playersInCurrentPosition.splice(randomIndex, 1);

        newCounter += 1;

        // After 10 selections, move to the next position
        if (newCounter === 10) {
          newCounter = 0; // Reset counter
          newCurrentIndex = (newCurrentIndex + 1) % Positions.length; // Move to the next position
        }

        // Update state with the new position and counter
        setCurrentIndex(newCurrentIndex);
        setCounter(newCounter);

        localStorage.setItem("parsedPlayers", JSON.stringify(players));

        // If there are no players left, add unsold players back
        if (areAllPlayersEmpty() && unsoldPlayers.length > 0) {
          toast({
            title:
              "All players have been auctioned. Adding unsold players back for auction.",
          });

          const parsedPlayers: Record<string, Player[]> = {
            goalkeeper: [],
            striker: [],
            defender: [],
            midfielder: [],
            allRounder: [],
          };

          unsoldPlayers.forEach((player) => {
            const position = player.Position.toLowerCase();
          
            if (parsedPlayers[position]) {
              parsedPlayers[position].push(player);
            } else {
              // Handle unknown position case
              parsedPlayers["allRounder"].push(player); // Or handle accordingly
            }
          });
          
          setPlayers(parsedPlayers);
          
          setUnsoldPlayers([]);

          setCanGetNewPlayer(true);
        }

        return selectedPlayer;
      } else {
        // No players available, move to the next position
        newCounter = 0; // Reset counter
        newCurrentIndex = (newCurrentIndex + 1) % Positions.length;

        // If we've looped through all positions without finding players, return null
        if (newCurrentIndex === currentIndex) {
          return null;
        }
      }
    }

    return null; // Fallback, though we should never reach this line
  };

  const handleNewRandomPlayer = () => {
    const val = getRandom();
    setSelectedPlayer(val);

    // Update the state after the selected player is set
    setCanGetNewPlayer(false); // Disable the button after selecting a player

    setPrice(0); // Reset price when a new player is selected
  };

  const handleSoldButton = () => {
    if (selectedPlayer) {
      const soldPlayer = { ...selectedPlayer, soldAt: price }; // Add the soldAt price
  
      // Ensure the position array exists before using map
      if (players[selectedPlayer.Position]) {
        const updatedPlayers = players[selectedPlayer.Position].map((player) =>
          player.name === selectedPlayer.name ? soldPlayer : player
        );
  
        setPlayers({
          ...players,
          [selectedPlayer.Position]: updatedPlayers,
        });
      }
  
      setSoldPlayers([...soldPlayers, soldPlayer]);
      setSelectedPlayer(null);
      setCanGetNewPlayer(true);
      toast({
        title: `${selectedPlayer.name} is Sold for ${price}`,
      });
    }
  };
  

  const handleUnsoldButton = () => {
    if (selectedPlayer) {
      setUnsoldPlayers([...unsoldPlayers, selectedPlayer]);
      setSelectedPlayer(null);
      setCanGetNewPlayer(true);
      toast({
        title: `${selectedPlayer.name} is Unsold`,
      });
    }
  };

  const handleIncrementPrice = (amount: number) => {
    setPrice(price + amount);
  };

  return (
    <div
      className="relative flex justify-center items-center h-screen bg-gray-900"
      style={{
        backgroundImage: "url('bg-img.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {selectedPlayer ? (
        <div className="flex w-3/4 h-3/4 bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          {/* Left side - Player details */}
          <div className="w-1/2 p-6">
            <div className="text-center">
              <h2 className="text-5xl font-medium text-white">
                {selectedPlayer.name}
              </h2>
              <p className="text-gray-400 text-3xl font-mono mt-2">
                {selectedPlayer.Position}
              </p>
            </div>
            {/* Price input and buttons */}
            <div className="mt-4 flex justify-center items-center">
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="bg-gray-600 text-white text-center w-20"
              />
              <div className="ml-4 flex space-x-4">
                <button
                  onClick={() => handleIncrementPrice(10)}
                  className="py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
                >
                  +10
                </button>
                <button
                  onClick={() => handleIncrementPrice(20)}
                  className="py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
                >
                  +20
                </button>
              </div>
            </div>
            <div className="mt-8 flex justify-evenly">
              <button
                onClick={handleSoldButton}
                className="w-32 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition"
              >
                Sold
              </button>
              <button
                onClick={handleUnsoldButton}
                className="w-32 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition"
              >
                Unsold
              </button>
            </div>
          <div className="text-white text-6xl flex justify-center mt-5 font-serif">RSTC 3.0</div>
          </div>

          {/* Right side - Image */}
          <div className="w-1/2 flex justify-center items-center">
            <img
              className="w-full h-full object-cover rounded-2xl border-4 border-gray-700"
              src={selectedPlayer.avatar}
              alt={selectedPlayer.name}
            />
          </div>
        </div>
      ) : (
        <button
          onClick={handleNewRandomPlayer}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 py-3 px-4 bg-transparent border border-white text-white font-semibold rounded hover:bg-white hover:bg-opacity-20 transition"
        >
          Get Random Player
        </button>
      )}
    </div>
  );
};

export default Page;
