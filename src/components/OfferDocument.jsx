import './OfferDocument.css';

export const OfferDocument = () => {
  return (
    <div className="offer-document">
      <div className="document-header">
        <h1>OFFER</h1>
        <div className="document-meta">
          <span className="document-number">OF-2025-001</span>
          <span className="document-meta-separator">·</span>
          <span className="document-date">Nov 6, 2025</span>
        </div>
      </div>
      <div className="document-section">
        <div className="party-info">
          <h3>From</h3>
          <p>Company Name</p>
          <p>Address Line 1</p>
          <p>City, Country</p>
        </div>
        <div className="party-info">
          <h3>To</h3>
          <p>Client Company</p>
          <p>Client Address</p>
          <p>Client City, Country</p>
        </div>
      </div>
      <div className="document-section">
        <table className="offer-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Product A</td>
              <td>10</td>
              <td>€50.00</td>
              <td>€500.00</td>
            </tr>
            <tr>
              <td>Product B</td>
              <td>5</td>
              <td>€100.00</td>
              <td>€500.00</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="document-footer">
        <div className="signatures">
          <div className="signature-box">
            <p>Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
};

