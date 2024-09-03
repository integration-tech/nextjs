"use client";

import React, { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { jsonData } from "../data";
import { Input } from "@/components/ui/input";
import Modal from "./Modal";

type Player = {
  name: string;
  Position: string;
  avatar: string;
  soldAt?: number; // Add soldAt to track the sold price
  year?: string;
  department?: string;
  playedRSTC?: string;
  playedInterDepartmental?: string;
};

const Page = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [canGetNewPlayer, setCanGetNewPlayer] = useState(true);
  const [soldPlayers, setSoldPlayers] = useState<Player[]>([]);
  const [unsoldPlayers, setUnsoldPlayers] = useState<Player[]>([]);
  const [players, setPlayers] = useState<Record<string, Player[]>>({});
  const [price, setPrice] = useState(0); // State for managing the price
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0); // Correctly initialized here
  const [counter, setCounter] = useState(0); // Correctly initialized here

  const Positions = [
    "goalkeeper",
    "midfielder",
    "allRounder",
    "striker",
    "defender",
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
        year: item["Year"],
        department: item["Department"],
        playedRSTC: item["Have you played RSTC 2.0?"],
        playedInterDepartmental:
          item["Have you played Inter-departmental football tournament?"],
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

    const savedSelectedPlayer = localStorage.getItem("selectedPlayer");
    const savedCurrentIndex = localStorage.getItem("currentIndex");
    const savedCounter = localStorage.getItem("counter");
    const savedCanGetNewPlayer = localStorage.getItem("canGetNewPlayer");

    if (savedSoldPlayers) {
      setSoldPlayers(JSON.parse(savedSoldPlayers));
    }
    if (savedUnsoldPlayers) {
      setUnsoldPlayers(JSON.parse(savedUnsoldPlayers));
    }
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }

    if (savedSelectedPlayer) {
      setSelectedPlayer(JSON.parse(savedSelectedPlayer));
    }
    if (savedCurrentIndex) {
      setCurrentIndex(Number(savedCurrentIndex)); // Ensure currentIndex is restored
    }
    if (savedCounter) {
      setCounter(Number(savedCounter)); // Ensure counter is restored
    }
    if (savedCanGetNewPlayer) {
      setCanGetNewPlayer(savedCanGetNewPlayer === "true");
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem("soldPlayers", JSON.stringify(soldPlayers));
    localStorage.setItem("unsoldPlayers", JSON.stringify(unsoldPlayers));
    localStorage.setItem("parsedPlayers", JSON.stringify(players));

    if (selectedPlayer) {
      localStorage.setItem("selectedPlayer", JSON.stringify(selectedPlayer));
    } else {
      localStorage.removeItem("selectedPlayer");
    }

    localStorage.setItem("currentIndex", String(currentIndex));
    localStorage.setItem("counter", String(counter));
    localStorage.setItem("canGetNewPlayer", String(canGetNewPlayer));
  }, [
    soldPlayers,
    unsoldPlayers,
    players,
    selectedPlayer,
    currentIndex,
    counter,
    canGetNewPlayer,
  ]);

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
        <div className="flex w-3/4 h-3/4 backdrop-blur-3xl bg-[#1e2d2f] shadow-lg rounded-lg overflow-hidden">
          {/* Left side - Player details */}
          <div className="w-1/2 p-6">
            <div className="text-center">
              <h2 className="text-3xl font-medium text-white">
                {selectedPlayer.name}
              </h2>
              <p className="text-gray-400 text-3xl font-semibold uppercase font-mono mt-2">
                {selectedPlayer.Position}
              </p>
              <h2 className="text-xl font-medium mt-4 text-white">
                Year : {selectedPlayer.year} <span className="mx-3">|</span>{" "}
                Dept : {selectedPlayer.department}
              </h2>
              <h2 className="text-xl mt-2 font-medium text-white">
                Played RSTC 2.0 : {selectedPlayer.playedRSTC}
              </h2>
              <h2 className="text-xl mt-2 font-medium text-white">
                Played Inter-Departmental :{" "}
                {selectedPlayer.playedInterDepartmental}
              </h2>
            </div>
            {/* Price input and buttons */}
            <div className="mt-11 flex justify-center items-center">
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
            <div className="mt-6 flex justify-evenly">
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
          </div>

          {/* Right side - Image */}
          <div className="w-1/2 flex justify-center items-center">
            <img
              className="w-full h-full object-contain rounded-2xl border-4 border-gray-700"
              src={selectedPlayer.avatar}
              alt={selectedPlayer.name}
            />
          </div>
        </div>
      ) : (
        <>
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute bottom-6 left-6 py-3 px-4 bg-transparent border border-white text-white font-semibold rounded hover:bg-white hover:bg-opacity-20 transition"
          >
            Finsh Auction
          </button>

          <button
            onClick={handleNewRandomPlayer}
            className="absolute bottom-6 left-1/2 font-Inter transform -translate-x-1/2 py-3 px-4 bg-transparent border border-white text-white font-semibold rounded hover:bg-white hover:bg-opacity-20 transition"
          >
            Get Random Player
          </button>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
      )}
    </div>
  );
};

export default Page;
