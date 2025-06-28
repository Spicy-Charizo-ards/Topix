const RoomCard = ({roomData}: any ) => {
    const {id, name, description, userCount} = roomData 
    console.log('DATA IN COMPONENET',roomData.name)
  return (
    <div key={id} className="p-4 border-2 border-clay-200 rounded bg-clay-50">
      <h3 className="text-clay-800 font-bold">{name}</h3>
      <p className="text-xs text-clay-500">{userCount}k members</p>
    </div>
  );
};

export default RoomCard;
