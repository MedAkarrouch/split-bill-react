import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [selectFriend, setSelectFriend] = useState(null);
  const [friends, setFriends] = useState(initialFriends);
  const handleSelectFriend = (friend) =>
    setSelectFriend((f) => (f?.id === friend.id ? null : friend));
  const handleSplitBill = (friend, newBalance) =>
    setFriends((friends) =>
      friends.map((el) =>
        el.id === friend.id ? { ...friend, balance: newBalance } : el
      )
    );
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectFriend={selectFriend}
          onSelectFriend={handleSelectFriend}
        />
        <button className="button">Add Friend</button>
      </div>
      {selectFriend && (
        <FormSplitBill
          onSelectFriend={setSelectFriend}
          onSplitBill={handleSplitBill}
          friend={selectFriend}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelectFriend, selectFriend }) {
  return (
    <ul>
      {friends.map((ele) => (
        <Friend
          selectFriend={selectFriend}
          onSelectFriend={onSelectFriend}
          key={ele.id}
          friend={ele}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, selectFriend, onSelectFriend }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}€
        </p>
      )}
      <button onClick={() => onSelectFriend(friend)} className="button">
        {selectFriend?.id === friend.id ? "close" : "select"}
      </button>
    </li>
  );
}
function FormAddFriend() {
  return (
    <form className="form-add-friend">
      <label>👫 Friend name</label>
      <input type="text" />
      <label>🌄 Image URL</label>
      <input type="text" />
      <button>Add</button>
    </form>
  );
}
function FormSplitBill({ friend, onSplitBill, onSelectFriend }) {
  const [bill, setBill] = useState(null);
  const [userExpense, setUserExpense] = useState(null);
  const [isPaying, setIsPaying] = useState("user");

  let friendExpense = bill - userExpense;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bill) return;
    if (bill && isPaying === "user" && !userExpense) return;
    if (bill && isPaying === "friend" && !friendExpense) return;
    console.log({ isPaying, bill, userExpense, friendExpense });
    const newBalance =
      isPaying === "user"
        ? friend.balance + friendExpense
        : friend.balance - userExpense;
    onSplitBill(friend, newBalance);
    onSelectFriend(null);
  };
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split A Bill With {friend.name}</h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(+e.target.value)}
      />
      <label>Your expense</label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) =>
          +e.target.value <= bill && setUserExpense(+e.target.value)
        }
      />
      <label>{friend.name}'s expense</label>
      <input value={friendExpense} type="text" disabled />
      <label>Who is paying the bill</label>
      <select value={isPaying} onChange={(e) => setIsPaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>
      <button className="button">Split bill</button>
    </form>
  );
}
