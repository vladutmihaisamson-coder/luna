import './SignatureFooter.css';

export const SignatureFooter = ({
  signatures = [],
  className = ''
}) => {
  const defaultSignatures = [
    { label: 'Shipper Signature' },
    { label: 'Carrier Signature' }
  ];

  const signatureList = signatures.length > 0 ? signatures : defaultSignatures;

  return (
    <div className={`signature-footer ${className}`}>
      <div className="signature-footer-section">
        {signatureList.map((signature, index) => (
          <div key={index} className="signature-footer-item">
            <div className="signature-footer-line"></div>
            <span className="signature-footer-label">{signature.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

