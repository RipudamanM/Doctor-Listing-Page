import React, { useState, useEffect } from 'react';
import 'App.css';

const specialtiesList = [
  "General Physician", "Dentist", "Dermatologist", "Paediatrician", "Gynaecologist", "ENT",
  "Diabetologist", "Cardiologist", "Physiotherapist", "Endocrinologist", "Orthopaedic",
  "Ophthalmologist", "Gastroenterologist", "Pulmonologist", "Psychiatrist", "Urologist",
  "Dietitian/Nutritionist", "Psychologist", "Sexologist", "Nephrologist", "Neurologist",
  "Oncologist", "Ayurveda", "Homeopath"
];

const App = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [consultationType, setConsultationType] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  const [sortOption, setSortOption] = useState('');

  // Mock data (replace with API if needed)
  useEffect(() => {
    const mockData = [
      { name: "Dr. Munaf Inamdar", specialties: ["General Physician","Oncologist"], experience: 33, fee: 700, consultationTypes: ["Video Consult", "In Clinic"] },
      { name: "Dr. Subhash Bajaj", specialties: ["General Physician", "Cardiologist"], experience: 21, fee: 800, consultationTypes: ["Video Consult"] },
      { name: "Dr. Mufaddal Zakir", specialties: ["General Physician","Paediatrician"], experience: 17, fee: 550, consultationTypes: ["In Clinic"] },
      { name: "Dr. Ajay Gangoli", specialties: ["General Physician"], experience: 44, fee: 500, consultationTypes: ["Video Consult", "In Clinic"] },
      { name: "Dr. Devanshi Chaudhary", specialties: ["Dentist"], experience: 5, fee: 300, consultationTypes: ["In Clinic"] },
      { name: "Dr. Devanshi Vaghani", specialties: ["Dentist"], experience: 2, fee: 350, consultationTypes: ["In Clinic"] }
    ];
    setDoctors(mockData);
    setFilteredDoctors(mockData);

    const params = new URLSearchParams(window.location.search);
    setSearchTerm(params.get('search') || '');
    setConsultationType(params.get('consultation') || '');
    setSelectedSpecialties(params.get('specialties')?.split(',') || []);
    setSortOption(params.get('sort') || '');
  }, []);

  // Handle filter updates
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (consultationType) params.set('consultation', consultationType);
    if (selectedSpecialties.length > 0) params.set('specialties', selectedSpecialties.join(','));
    if (sortOption) params.set('sort', sortOption);

    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
    applyFilters();
  }, [searchTerm, consultationType, selectedSpecialties, sortOption]);

  // Handle Back/Forward browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setSearchTerm(params.get('search') || '');
      setConsultationType(params.get('consultation') || '');
      setSelectedSpecialties(params.get('specialties')?.split(',') || []);
      setSortOption(params.get('sort') || '');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const applyFilters = () => {
    let filtered = [...doctors];

    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (consultationType) {
      filtered = filtered.filter(doctor =>
        doctor.consultationTypes.includes(consultationType)
      );
    }

    if (selectedSpecialties.length > 0) {
      filtered = filtered.filter(doctor =>
        doctor.specialties.some(s => selectedSpecialties.includes(s))
      );
    }

    if (sortOption === 'fees') {
      filtered.sort((a, b) => a.fee - b.fee);
    } else if (sortOption === 'experience') {
      filtered.sort((a, b) => b.experience - a.experience);
    }

    setFilteredDoctors(filtered);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const matches = doctors
        .filter(doctor => doctor.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 3);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (name) => {
    setSearchTerm(name);
    setSuggestions([]);
  };

  const handleConsultationChange = (type) => {
    setConsultationType(type);
  };

  const handleSpecialtyChange = (specialty) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  return (
    <div className="container">
      <div className="search-container">
        <input
          data-testid="autocomplete-input"
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search doctors..."
          className="search-input"
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((doctor, index) => (
              <li
                key={index}
                data-testid="suggestion-item"
                onClick={() => handleSuggestionClick(doctor.name)}
                className="suggestion-item"
              >
                {doctor.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="main-content">
        {/* Scrollable Filter Panel */}
        <div className="filter-panel">
          <h3 className="filter-header">Filters</h3>

          <div className="filter-section">
            <h4>Sort by</h4>
            <label>
              <input
                type="radio"
                name="sort"
                value="fees"
                checked={sortOption === 'fees'}
                onChange={() => handleSortChange('fees')}
              />
              Fees: Low-High
            </label>
            <label>
              <input
                type="radio"
                name="sort"
                value="experience"
                checked={sortOption === 'experience'}
                onChange={() => handleSortChange('experience')}
              />
              Experience: High-Low
            </label>
          </div>

          <div className="filter-section">
            <h4>Mode of Consultation</h4>
            <label>
              <input
                type="radio"
                name="consultation"
                value="Video Consult"
                checked={consultationType === 'Video Consult'}
                onChange={() => handleConsultationChange('Video Consult')}
              />
              Video Consultation
            </label>
            <label>
              <input
                type="radio"
                name="consultation"
                value="In Clinic"
                checked={consultationType === 'In Clinic'}
                onChange={() => handleConsultationChange('In Clinic')}
              />
              In Clinic
            </label>
          </div>

          <div className="filter-section specialties-scroll">
            <h4>Specialties</h4>
            {specialtiesList.map(specialty => (
              <label key={specialty}>
                <input
                  type="checkbox"
                  checked={selectedSpecialties.includes(specialty)}
                  onChange={() => handleSpecialtyChange(specialty)}
                />
                {specialty}
              </label>
            ))}
          </div>
        </div>

        <div className="doctor-list">
          {filteredDoctors.map((doctor, index) => (
            <div key={index} className="doctor-card">
              <div className="doctor-info">
                <h3>{doctor.name}</h3>
                <p>{doctor.specialties.join(', ')}</p>
                <p>{doctor.experience} yrs exp.</p>
              </div>
              <div>
                <p className="doctor-fee">₹{doctor.fee}</p>
                <button className="book-button">Book Appointment</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
