import React from "react";

const ProfileCard = ({ provider, earnings, requests }) => {
  return (
    <div className="bg-white p-5 rounded shadow mb-6">

      <h2 className="text-xl font-bold">{provider?.name}</h2>
      <p>{provider?.service}</p>

      <div className="mt-3">
        <p>Total Requests: {requests.length}</p>
        <p>Accepted: {requests.filter(r => r.status === "accepted").length}</p>
        <p className="text-green-600 font-bold">
          Earnings: Rs {earnings}
        </p>
      </div>

    </div>
  );
};

export default ProfileCard;