import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const TimeGraph = ({ entries, startDate, endDate }) => {
    // Process data for the chart
    const processData = () => {
        if (!entries || entries.length === 0) return [];

        // Create a map of date -> entry
        const entryMap = new Map();
        entries.forEach(entry => {
            const dateStr = new Date(entry.date).toLocaleDateString();
            entryMap.set(dateStr, entry);
        });

        const data = [];
        let current = new Date(startDate);
        const end = new Date(endDate);

        // Fill in all days in the range
        while (current <= end) {
            const dateStr = current.toLocaleDateString();
            const entry = entryMap.get(dateStr);

            let clockIn = null;
            let clockOut = null;

            if (entry) {
                const login = new Date(entry.loginTime);
                clockIn = login.getHours() + login.getMinutes() / 60;

                if (entry.logoutTime) {
                    const logout = new Date(entry.logoutTime);
                    clockOut = logout.getHours() + logout.getMinutes() / 60;
                }
            }

            // Calculate duration if both exist
            let duration = null;
            if (clockIn !== null && clockOut !== null) {
                duration = (clockOut - clockIn).toFixed(2);
            }

            data.push({
                date: current.getDate(),
                fullDate: dateStr,
                clockIn: clockIn ? parseFloat(clockIn.toFixed(2)) : null,
                clockOut: clockOut ? parseFloat(clockOut.toFixed(2)) : null,
                duration: duration
            });

            current.setDate(current.getDate() + 1);
        }
        return data;
    };

    const data = processData();

    const formatTimeAxis = (decimal) => {
        if (decimal === null || decimal === undefined) return '';
        const hours = Math.floor(decimal);
        const minutes = Math.round((decimal - hours) * 60);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const dataPoint = payload[0].payload;
            return (
                <div className="custom-tooltip bg-white p-3 border border-gray-200 shadow-xl rounded-lg" style={{ zIndex: 100 }}>
                    <p className="label font-bold text-gray-800 mb-2">{`Date: ${dataPoint.fullDate}`}</p>
                    {payload.map((p, index) => (
                        <p key={index} style={{ color: p.color, marginBottom: '4px', fontWeight: 500 }}>
                            {`${p.name}: ${formatTimeAxis(p.value)}`}
                        </p>
                    ))}
                    {dataPoint.duration && (
                        <p className="mt-2 pt-2 border-t border-gray-100 text-sm font-bold text-blue-800">
                            Duration: {dataPoint.duration} hrs
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ width: '100%', height: 400, marginTop: '20px', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '20px', color: '#1a365d', fontSize: '1.2rem', fontWeight: '600' }}>
                Attendance Graph ({startDate.toLocaleDateString()} - {endDate.toLocaleDateString()})
            </h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 30,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" label={{ value: 'Day of Month', position: 'insideBottom', offset: -10 }} />
                    <YAxis
                        domain={[10, 19]}
                        tickFormatter={(tick) => `${tick}:00`}
                        label={{ value: 'Time (24h)', angle: -90, position: 'insideLeft' }}
                        allowDataOverflow={true}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Line
                        type="monotone"
                        dataKey="clockIn"
                        name="Clock In"
                        stroke="#10b981"
                        activeDot={{ r: 8 }}
                        connectNulls={false}
                        strokeWidth={2}
                    />
                    <Line
                        type="monotone"
                        dataKey="clockOut"
                        name="Clock Out"
                        stroke="#ef4444"
                        activeDot={{ r: 8 }}
                        connectNulls={false}
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TimeGraph;
