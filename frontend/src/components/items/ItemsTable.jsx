function ItemsTable({ items }) {

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
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ItemsTable;