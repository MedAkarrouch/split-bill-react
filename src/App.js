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
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectFriend] = useState(null);
  const handleShowAddFriend = () => setShowAddFriend((s) => !s);
  const handleAddFriend = (friend) => {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  };
  const handleSelection = (friend) => {
    setSelectFriend((f) => (f?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  };
  const handleSplitBill = (val) => {
    setFriends((friends) =>
      friends.map((el) =>
        el.id === selectedFriend.id ? { ...el, balance: el.balance + val } : el
      )
    );
    setSelectFriend(null);
  };
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          handleSelection={handleSelection}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill friend={selectedFriend} onSplitBill={handleSplitBill} />
      )}
    </div>
  );
}
function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}
function FriendsList({ friends, selectedFriend, handleSelection }) {
  // const friends = initialFriends;
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          selectedFriend={selectedFriend}
          handleSelection={handleSelection}
          key={friend.id}
          friend={friend}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, selectedFriend, handleSelection }) {
  // console.log(selectedFriend.id, friend.id);
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You Owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} Owes You {friend.balance}€
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => handleSelection(friend)}>
        {isSelected ? "close" : "select"}
      </Button>
    </li>
  );
}
function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = { id, image: `${image}?=${id}`, name, balance: 0 };
    console.log(newFriend);
    onAddFriend(newFriend);
    setImage("https://i.pravatar.cc/48");
    setName("");
  };
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend Name</label>
      <input
        onChange={(e) => setName(e.target.value)}
        type="text"
        value={name}
      />
      <label>Image Url</label>
      <input
        onChange={(e) => setImage(e.target.value)}
        type="text"
        value={image}
      />
      <Button>Add Friend</Button>
    </form>
  );
}
function FormSplitBill({ friend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const [paidBy, setPaidBy] = useState("user");
  const friendExpense = bill ? bill - userExpense : "";
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bill || !userExpense) return;
    onSplitBill(paidBy === "user" ? friendExpense : -userExpense);
  };
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {friend.name}</h2>
      <label>Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => +e.target.value && setBill(+e.target.value)}
      />
      <label>Your Expense</label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) =>
          +e.target.value <= bill && setUserExpense(+e.target.value)
        }
      />
      <label>{friend.name}'s Expense</label>
      <input type="text" value={friendExpense} disabled />
      <label>Who is paying the bill</label>
      <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
