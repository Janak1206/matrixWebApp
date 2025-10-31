import React, { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
// Import your logo image here if you have one, e.g.:
import InstituteLogo from "../assets/matrix_logo.jpg";
import env from '../env';


// --- Type Definitions ---
interface FormData {
  studentName: string;
  address: string;
  email: string;
  mobile: string;
  dob: string;
  school: string;
  standard: string;
  standardOtherDetails: string;
  board: string;
  boardOtherDetails: string;
  programDetails: string[]; // Array of selected program options
}

const programOptions = {
  'Practicle': ['Physics', 'Chemistry', 'Bio-logy', 'Computer'],
  'Investigatory Project': ['Physics', 'Chemistry', 'Bio-logy'],
  'School Project': ['Science Project', 'Maths Project', 'Innovative Project'],
};

const INITIAL_FORM_DATA: FormData = {
  studentName: '', address: '', email: '', mobile: '', dob: '', school: '',
  standard: '', standardOtherDetails: '', board: '', boardOtherDetails: '',
  programDetails: [],
};

// --- Static Header Component ---
const InstituteHeader: React.FC = () => (
  <div className="institute-header">
    <div className="logo-container">
      {/* Replace with your logo source */}
      <img src={InstituteLogo} alt="Institute Logo" className="institute-logo" />
    </div>
    <div className="details-container">
      <h2>Matrix Innovation Hub</h2>
      <p>511, Solaris Business Hub, Bhuyangdev Cross Road, Sola, Ahmedabad - 380063</p>
      <p>Contact: +91 97379 79706 | Email: matrixinnovationhub@gmail.com</p>
    </div>
  </div>
);

// --- Main Component Definition ---

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // ... (handleChange and handleProgramChange functions remain the same) ...
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProgramChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const currentPrograms = prev.programDetails;
      if (checked) {
        return { ...prev, programDetails: [...currentPrograms, value] };
      } else {
        return { ...prev, programDetails: currentPrograms.filter(p => p !== value) };
      }
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('Submitting registration...');

    // 🚀 CRITICAL CHANGE: Program Details Compulsory Check
    if (formData.programDetails.length === 0) {
      setMessage('❌ Submission Error: Please select at least one program detail.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${env.API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data: { id?: number; message?: string } = await response.json();

      if (response.ok) {
        setMessage(`✅ Registration Successful! ID: ${data.id}. Form cleared.`);
        setFormData(INITIAL_FORM_DATA);
      } else {
        setMessage(`❌ Submission Error: ${data.message || 'Check network connection.'}`);
      }
    } catch (error) {
      console.error("Network or Fetch Error:", error);
      setMessage('❌ Network Error: Could not connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      {/* 👈 Institute Header goes here */}
      <InstituteHeader />

      <h1>Student Registration Form</h1>
      <form onSubmit={handleSubmit}>

        {/* --- PERSONAL DETAILS --- */}
        <fieldset className="form-section">
          <legend>Personal Details</legend>
          {/* ... (input fields remain the same) ... */}
          <div className="input-group">
            <label htmlFor="studentName">Student Name:</label>
            <input type="text" id="studentName" name="studentName" value={formData.studentName} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label htmlFor="address">Address:</label>
            <textarea id="address" name="address" value={formData.address} onChange={handleChange} required rows={3} />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="mobile">Mobile:</label>
              <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} pattern="[0-9]{10,15}" required />
            </div>
            <div className="input-group">
              <label htmlFor="dob">Date of Birth:</label>
              <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required />
            </div>
          </div>
          <div className="input-group">
            <label htmlFor="school">School:</label>
            <input type="text" id="school" name="school" value={formData.school} onChange={handleChange} required />
          </div>
          {/* --- CONDITIONAL FIELDS: STANDARD & BOARD --- */}
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="standard">Standard:</label>
              <select id="standard" name="standard" value={formData.standard} onChange={handleChange} required>
                <option value="">-- Select Standard --</option>
                {[...Array(12).keys()].map(i => <option key={i} value={i + 1}>{i + 1}</option>)}
                <option value="Other">Other</option>
              </select>
            </div>
            {formData.standard === 'Other' && (
              <div className="input-group conditional-input">
                <label htmlFor="standardOtherDetails">Standard Details:</label>
                <input type="text" id="standardOtherDetails" name="standardOtherDetails" value={formData.standardOtherDetails} onChange={handleChange} required={formData.standard === 'Other'} />
              </div>
            )}
          </div>
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="board">Board:</label>
              <select id="board" name="board" value={formData.board} onChange={handleChange} required>
                <option value="">-- Select Board --</option>
                <option value="GSEB">GSEB</option>
                <option value="CBSE">CBSE</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {formData.board === 'Other' && (
              <div className="input-group conditional-input">
                <label htmlFor="boardOtherDetails">Board Details:</label>
                <input type="text" id="boardOtherDetails" name="boardOtherDetails" value={formData.boardOtherDetails} onChange={handleChange} required={formData.board === 'Other'} />
              </div>
            )}
          </div>
        </fieldset>

        {/* --- PROGRAM DETAILS (Multi-Choice) --- */}
        <fieldset className="form-section">
          <legend>Program Details </legend>  {/* <span style={{ color: 'red' }}>(Compulsory)</span> */}
          {/* ... (checkbox grid remains the same) ... */}
          <div className="program-details-grid">
            {Object.entries(programOptions).map(([category, options]) => (
              <div key={category} className="category-group">
                <h4>{category}</h4>
                {options.map(option => {
                  const value = `${option.replace(/-/g, '')}_${category.replace(/\s/g, '')}`;
                  return (
                    <div key={value} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={value}
                        name="programDetails"
                        value={value}
                        checked={formData.programDetails.includes(value)}
                        onChange={handleProgramChange}
                      />
                      <label htmlFor={value}>{option}</label>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </fieldset>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register Student'}
        </button>
      </form>

      {message && <p className={`message ${message.startsWith('❌') ? 'error' : 'success'}`}>{message}</p>}
    </div>
  );
}

export default RegistrationForm;