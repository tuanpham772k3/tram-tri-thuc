import { Cell, Pie, PieChart, Tooltip } from "recharts";
import Home from "./Home/Home";

const StorageStats = () => {
    const data = [
        { name: "PDF", value: 400 },
        { name: "Word", value: 300 },
        { name: "Excel", value: 200 },
        { name: "Ảnh", value: 100 },
    ];
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (
        <Home>
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Thống kê dung lượng
                </h2>
                <PieChart width={400} height={400}>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        fill="#8884d8"
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-200 dark:bg-gray-700">
                            <th className="p-2">Loại file</th>
                            <th className="p-2">Số lượng</th>
                            <th className="p-2">Dung lượng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr
                                key={index}
                                className="border-b dark:border-gray-600"
                            >
                                <td className="p-2">{item.name}</td>
                                <td className="p-2">
                                    {Math.floor(item.value / 10)}
                                </td>
                                <td className="p-2">{item.value} MB</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Giải phóng dung lượng
                </button>
            </div>
        </Home>
    );
};

export default StorageStats;
