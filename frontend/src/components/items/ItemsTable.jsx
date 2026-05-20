function ItemsTable({ items, onDeleteItem, onEditItem }) {
 if (items.length === 0) {
    return(
    <div className="items-empty-state">
      <h3>No items added yet</h3>
      <p>Start by adding an item to your wishlist!</p>
    </div>
    );
  }

  return (
    <table className="items-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Item</th>
          <th>Description</th>
          <th>Price</th>
          <th>Currency</th>
          <th>Converted</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={item.id}>
            <td>{index + 1}</td>
            <td>{item.item_name}</td>
            <td>{item.description}</td>
            <td>{item.foreign_price}</td>
            <td>{item.foreign_currency}</td>
            <td>{item.converted_price}</td>
            <td>
              <button className="primary-btn" onClick={()=>onEditItem(item)}>Edit</button>
              <button className="secondary-btn" onClick={()=>onDeleteItem(item)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ItemsTable;