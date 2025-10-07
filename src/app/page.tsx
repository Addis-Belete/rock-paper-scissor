import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center w-full justify-items-center min-h-screen pb-20 gap-16 sm:p-20">
      <main className="w-full flex flex-col gap-4">
        <div className="flex flex justify-between items-center">
          <ul className="flex gap-4 items-center">
            <li>
              <Button variant="outline">Active</Button>
            </li>
            <li>
              <Button variant="outline">Win</Button>
            </li>
            <li>
              <Button variant="outline">Loss</Button>
            </li>
            <li>
              <Button variant="outline">Draw</Button>
            </li>
            <li>
              <Button variant="outline">Cancelled</Button>
            </li>
          </ul>

          <div className="">
            <Button className="flex gap-2 items-center">
              <Plus />
              <span>Create New Game</span>
            </Button>
          </div>
        </div>
        <div className="flex gap-4 flex-col">
          <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900 shadow-lg">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-300">
                    No.
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-300">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-300">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-300">
                    Address
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-300">
                    Staked ETH
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-300">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left font-semibold text-gray-300">
                    Action
                  </th>
                
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr className="hover:bg-gray-800/60 transition">
                  <td className="px-6 py-4 text-sm text-blue-400 max-w-[150px]">
                    1.
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-100">22-02-2025</td>
                  <td className="px-6 py-4 text-sm text-gray-100">Player 1</td>
                  <td className="px-6 py-4 text-sm text-gray-100">0x02323...3453</td>
                  <td className="px-6 py-4 text-sm text-gray-100">2 ETH</td>
                  <td className="px-6 py-4 text-sm text-gray-100">Win</td>
                  <td className="px-6 py-4 text-sm text-gray-100"><Button variant="outline">Reveal</Button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p>This is the footer of RPS game</p>
      </footer>
    </div>
  );
}
