import { useState, useRef, useEffect } from 'react';
import { IconButton } from './design-system/molecules/IconButton/IconButton';
import { Icon } from './design-system/atoms/Icon/Icon';
import { Input } from './design-system/atoms/Input/Input';
import { Button } from './design-system/atoms/Button/Button';
import './CompanySetupModal.css';

export const CompanySetupModal = ({ isOpen, onClose, onSave }) => {
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const fileInputRef = useRef(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  // Load saved company data if exists
  useEffect(() => {
    if (isOpen) {
      const savedCompany = localStorage.getItem('companyDetails');
      if (savedCompany) {
        try {
          const company = JSON.parse(savedCompany);
          setCompanyName(company.name || '');
          setCompanyAddress(company.address || '');
          setCompanyEmail(company.email || '');
          setCompanyPhone(company.phone || '');
          setCompanyWebsite(company.website || '');
          if (company.logo) {
            setLogoPreview(company.logo);
          }
        } catch (e) {
          console.error('Error loading company details:', e);
        }
      }
    }
  }, [isOpen]);

  const handleLogoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLogoPreview(reader.result);
          setLogoFile(file);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file');
      }
    }
  };

  const handleSave = () => {
    const companyData = {
      name: companyName,
      address: companyAddress,
      email: companyEmail,
      phone: companyPhone,
      website: companyWebsite,
      logo: logoPreview,
      setupCompleted: true,
    };
    
    localStorage.setItem('companyDetails', JSON.stringify(companyData));
    localStorage.setItem('companySetupCompleted', 'true');
    
    if (onSave) {
      onSave(companyData);
    }
    
    onClose();
  };

  const handleSkip = () => {
    localStorage.setItem('companySetupSkipped', 'true');
    onClose();
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setLogoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="company-setup-modal-overlay" onClick={onClose}>
      <div className="company-setup-modal" onClick={(e) => e.stopPropagation()}>
        <div className="company-setup-modal-header">
          <h2 className="company-setup-modal-title">Company Setup</h2>
          <IconButton
            icon="x"
            variant="ghost"
            size="md"
            onClick={onClose}
            aria-label="Close"
          />
        </div>

        <div className="company-setup-modal-content">
          <p className="company-setup-modal-description">
            Add your company details to personalize your documents and branding.
          </p>

          <div className="company-setup-logo-section">
            <label className="company-setup-logo-label">Company Logo</label>
            <div className="company-setup-logo-upload">
              {logoPreview ? (
                <div className="company-setup-logo-preview">
                  <img src={logoPreview} alt="Company logo" />
                  <button
                    className="company-setup-logo-remove"
                    onClick={handleRemoveLogo}
                    aria-label="Remove logo"
                  >
                    <Icon name="x" size="sm" variant="outline" />
                  </button>
                </div>
              ) : (
                <button
                  className="company-setup-logo-upload-button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Icon name="upload" size="lg" variant="outline" />
                  <span>Upload Logo</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoSelect}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div className="company-setup-form">
            <div className="company-setup-form-field">
              <label htmlFor="company-name">Company Name</label>
              <Input
                id="company-name"
                type="text"
                value={companyName}
                onChange={setCompanyName}
                placeholder="Enter company name"
                className="form-input-square"
              />
            </div>

            <div className="company-setup-form-field">
              <label htmlFor="company-address">Address</label>
              <Input
                id="company-address"
                type="text"
                value={companyAddress}
                onChange={setCompanyAddress}
                placeholder="Enter company address"
                className="form-input-square"
              />
            </div>

            <div className="company-setup-form-row">
              <div className="company-setup-form-field">
                <label htmlFor="company-email">Email</label>
                <Input
                  id="company-email"
                  type="email"
                  value={companyEmail}
                  onChange={setCompanyEmail}
                  placeholder="Enter email"
                  className="form-input-square"
                />
              </div>

              <div className="company-setup-form-field">
                <label htmlFor="company-phone">Phone</label>
                <Input
                  id="company-phone"
                  type="tel"
                  value={companyPhone}
                  onChange={setCompanyPhone}
                  placeholder="Enter phone"
                  className="form-input-square"
                />
              </div>
            </div>

            <div className="company-setup-form-field">
              <label htmlFor="company-website">Website</label>
              <Input
                id="company-website"
                type="url"
                value={companyWebsite}
                onChange={setCompanyWebsite}
                placeholder="Enter website URL"
                className="form-input-square"
              />
            </div>
          </div>
        </div>

        <div className="company-setup-modal-footer">
          <Button
            variant="ghost"
            size="md"
            onClick={handleSkip}
          >
            Skip
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

