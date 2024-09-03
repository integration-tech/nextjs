// "use client";

// import React, { useState, useEffect } from "react";
// import { toast } from "@/components/ui/use-toast"
// import {jsonData} from '../data'

// // Define the Player type
// type Player = {
//   name: string;
//   Position: string;
//   avatar: string;
// };

// const Page = () => {
//   const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
//   const [canGetNewPlayer, setCanGetNewPlayer] = useState(true); // New state to track button enable/disable
//   const [soldPlayers, setSoldPlayers] = useState<Player[]>([]);
//   const [unsoldPlayers, setUnsoldPlayers] = useState<Player[]>([]);
//   const [players, setPlayers] = useState<Record<string, Player[]>>({}); // Store players by position
//   const Positions = ["striker", "defender", "midfielder", "allRounder"];

//   // Load data and set players
//   useEffect(() => {
//     const parsedPlayers: Record<string, Player[]> = {
//       striker: [],
//       defender: [],
//       midfielder: [],
//       allRounder: []
//     };

//     jsonData.forEach(item => {
//       const position = item["Position"].toLowerCase();
//       const player: Player = {
//         name: item["Name"] || "Unknown",
//         Position: position,
//         avatar: item["Photo"] || "https://robohash.org/default.png"
//       };

//       if (parsedPlayers[position]) {
//         parsedPlayers[position].push(player);
//       } else {
//         parsedPlayers["allRounder"].push(player); // Default position if not specified
//       }
//     });

//     setPlayers(parsedPlayers);
//   }, []);

//   useEffect(() => {
//     // Load sold and unsold players from localStorage
//     const savedSoldPlayers = localStorage.getItem('soldPlayers');
//     const savedUnsoldPlayers = localStorage.getItem('unsoldPlayers');

//     if (savedSoldPlayers) {
//       setSoldPlayers(JSON.parse(savedSoldPlayers));
//     }
//     if (savedUnsoldPlayers) {
//       setUnsoldPlayers(JSON.parse(savedUnsoldPlayers));
//     }
//   }, []);

//   useEffect(() => {
//     // Save sold and unsold players to localStorage whenever they change
//     localStorage.setItem('soldPlayers', JSON.stringify(soldPlayers));
//     localStorage.setItem('unsoldPlayers', JSON.stringify(unsoldPlayers));
//   }, [soldPlayers, unsoldPlayers]);

//   const [currentIndex, setCurrentIndex] = useState(0); // Track current position in Positions
//   const [counter, setCounter] = useState(0); // Count up to 10 selections per position

//   const getRandom = (): Player | null => {
//     const currentPosition = Positions[currentIndex];
//     const playersInCurrentPosition = players[currentPosition] || [];

//     if (playersInCurrentPosition.length === 0) {
//       return null; // No more players available in the current position
//     }

//     const randomIndex = Math.floor(Math.random() * playersInCurrentPosition.length);
//     const selectedPlayer = playersInCurrentPosition[randomIndex];

//     // Remove the selected player from the array
//     playersInCurrentPosition.splice(randomIndex, 1);

//     setCounter(counter + 1);

//     // After 10 selections, move to the next position
//     if (counter + 1 === 10) {
//       setCounter(0); // Reset counter
//       setCurrentIndex((currentIndex + 1) % Positions.length); // Move to the next position
//     }

//     return selectedPlayer;
//   };

//   const handleNewRandomPlayer = () => {
//     const val = getRandom();
//     setSelectedPlayer(val);
//     setCanGetNewPlayer(false); // Disable the button after selecting a player
//   };

//   const handleSoldButton = () => {
//     if (selectedPlayer) {
//       setSoldPlayers([...soldPlayers, selectedPlayer]);
//       setSelectedPlayer(null);
//       setCanGetNewPlayer(true);
//       toast({
//         title: `${selectedPlayer.name} is Sold`,
//       });
//     }
//   };

//   const handleUnsoldButton = () => {
//     if (selectedPlayer) {
//       setUnsoldPlayers([...unsoldPlayers, selectedPlayer]);
//       setSelectedPlayer(null);
//       setCanGetNewPlayer(true);
//       toast({
//         title: `${selectedPlayer.name} is Unsold`,
//       });
//     }
//   };

//   return (
//     <>
//       <div className="flex justify-center items-center h-screen bg-gray-900">
//         <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden w-80 p-6">
//           <div className="flex justify-center">
//             {selectedPlayer && (
//               <img
//                 className="w-32 h-32 object-cover rounded-full border-4 border-gray-700"
//                 src={selectedPlayer.avatar}
//                 alt={selectedPlayer.name}
//               />
//             )}
//           </div>
//           <div className="text-center mt-4">
//             {selectedPlayer && (
//               <>
//                 <h2 className="text-xl font-semibold text-white">
//                   {selectedPlayer.name}
//                 </h2>
//                 <p className="text-gray-400">{selectedPlayer.Position}</p>
//               </>
//             )}
//           </div>
//           <div className="mt-6 flex justify-around">
//             <button
//               onClick={handleSoldButton}
//               className="w-32 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition"
//             >
//               Sold
//             </button>
//             <button
//               onClick={handleUnsoldButton}
//               className="w-32 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition"
//             >
//               Unsold
//             </button>
//           </div>
//           <div className="mt-6 flex justify-center">
//             <button
//               onClick={handleNewRandomPlayer}
//               className={`w-64 py-2 font-semibold rounded transition ${canGetNewPlayer ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-500 text-gray-300 cursor-not-allowed'}`}
//               disabled={!canGetNewPlayer} // Disable button based on state
//             >
//               Get New Player
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Page;


"use client";

import React, { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast"
import {jsonData} from '../data'

// Define the Player type
type Player = {
  name: string;
  Position: string;
  avatar: string;
};

const Page = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [canGetNewPlayer, setCanGetNewPlayer] = useState(true); // New state to track button enable/disable
  const [soldPlayers, setSoldPlayers] = useState<Player[]>([]);
  const [unsoldPlayers, setUnsoldPlayers] = useState<Player[]>([]);
  const [players, setPlayers] = useState<Record<string, Player[]>>({}); // Store players by position
  const Positions = ["striker", "defender", "midfielder", "allRounder"];

  // Load data and set players
  useEffect(() => {
    const parsedPlayers: Record<string, Player[]> = {
      striker: [],
      defender: [],
      midfielder: [],
      allRounder: []
    };

    jsonData.forEach(item => {
      const position = item["Position"].toLowerCase();
      const player: Player = {
        name: item["Name"] || "Unknown",
        Position: position,
        avatar: item["Photo"] || "https://robohash.org/default.png"
      };

      if (parsedPlayers[position]) {
        parsedPlayers[position].push(player);
      } else {
        parsedPlayers["allRounder"].push(player); // Default position if not specified
      }
    });

    setPlayers(parsedPlayers);
  }, []);

  useEffect(() => {
    // Load sold and unsold players from localStorage
    const savedSoldPlayers = localStorage.getItem('soldPlayers');
    const savedUnsoldPlayers = localStorage.getItem('unsoldPlayers');

    if (savedSoldPlayers) {
      setSoldPlayers(JSON.parse(savedSoldPlayers));
    }
    if (savedUnsoldPlayers) {
      setUnsoldPlayers(JSON.parse(savedUnsoldPlayers));
    }
  }, []);

  useEffect(() => {
    // Save sold and unsold players to localStorage whenever they change
    localStorage.setItem('soldPlayers', JSON.stringify(soldPlayers));
    localStorage.setItem('unsoldPlayers', JSON.stringify(unsoldPlayers));
  }, [soldPlayers, unsoldPlayers]);

  const [currentIndex, setCurrentIndex] = useState(0); // Track current position in Positions
  const [counter, setCounter] = useState(0); // Count up to 10 selections per position

  const getRandom = (): Player | null => {
    let availablePlayerFound = false;
    let newCurrentIndex = currentIndex;
    let newCounter = counter;
  
    while (!availablePlayerFound) {
      const currentPosition = Positions[newCurrentIndex];
      const playersInCurrentPosition = players[currentPosition] || [];
  
      if (playersInCurrentPosition.length > 0) {
        // Players available in the current position
        availablePlayerFound = true;
  
        const randomIndex = Math.floor(Math.random() * playersInCurrentPosition.length);
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
    setCanGetNewPlayer(false); // Disable the button after selecting a player
  };

  const handleSoldButton = () => {
    if (selectedPlayer) {
      setSoldPlayers([...soldPlayers, selectedPlayer]);
      setSelectedPlayer(null);
      setCanGetNewPlayer(true);
      toast({
        title: `${selectedPlayer.name} is Sold`,
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

  return (
    <>
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden w-80 p-6">
          <div className="flex justify-center">
            {selectedPlayer && (
              <img
                className="w-32 h-32 object-cover rounded-full border-4 border-gray-700"
                src={selectedPlayer.avatar}
                alt={selectedPlayer.name}
              />
            )}
          </div>
          <div className="text-center mt-4">
            {selectedPlayer && (
              <>
                <h2 className="text-xl font-semibold text-white">
                  {selectedPlayer.name}
                </h2>
                <p className="text-gray-400">{selectedPlayer.Position}</p>
              </>
            )}
          </div>
          <div className="mt-6 flex justify-around">
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
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleNewRandomPlayer}
              className={`w-64 py-2 font-semibold rounded transition ${canGetNewPlayer ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-500 text-gray-300 cursor-not-allowed'}`}
              disabled={!canGetNewPlayer} // Disable button based on state
            >
              Get New Player
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
