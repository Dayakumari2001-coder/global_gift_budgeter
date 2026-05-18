function ItemBlock({
  item,
  onDelete
}) {
  if (!item) {
    return null;
  }
  return (
    <div className="item-card">
      <h3>
        {item.item_name}
      </h3>
      <p>
        {item.description}
      </p>
      <div className="item-price">
        <span>
          {item.foreign_price}
          {" "}
          {item.foreign_currency}
        </span>
      </div>
      <div className="item-converted">
        Converted:
        {" "}
        {item.converted_price}
      </div>

      <button
        className="delete-btn"
        onClick={() =>
          onDelete(item.id)
        }
      >
        Delete
      </button>
    </div>
  );
}

export default ItemBlock;