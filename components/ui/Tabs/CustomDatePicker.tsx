"use client";

import  { useState } from 'react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, isSameMonth, isSameDay, 
  eachDayOfInterval, setYear, getYear 
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Pencil } from 'lucide-react';

interface CustomDatePickerProps {
  onSelect: (date: Date) => void;
  onClose: () => void;
}

const CustomDatePicker = ({ onSelect, onClose }: CustomDatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date(1990, 0, 1));
  const [currentMonth, setCurrentMonth] = useState(new Date(1990, 0, 1));
  const [showYearSelector, setShowYearSelector] = useState(false);

  // Génération des jours pour la grille
  const calendarStart = startOfWeek(startOfMonth(currentMonth));
  const calendarEnd = endOfWeek(endOfMonth(currentMonth));
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Liste des 100 dernières années
  const currentYear = getYear(new Date());
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleYearChange = (year: number) => {
    const newDate = setYear(currentMonth, year);
    setCurrentMonth(newDate);
    setShowYearSelector(false);
  };

  return (
    <div className="absolute z-[100] mt-2 max-w-xs bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 font-sans">
      {/* Header : Affichage Date */}
      <div className="p-5 bg-white border-b border-gray-50">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Date de naissance</p>
        <div className="flex justify-between items-center mt-2">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {format(selectedDate, 'EEE d MMM', { locale: fr })}
          </h2>
          <Pencil size={18} className="text-gray-400" />
        </div>
      </div>

      <div className="p-4">
        {/* Navigation Mois/Année */}
        <div className="flex justify-between items-center mb-4 px-2">
          <button 
            onClick={() => setShowYearSelector(!showYearSelector)}
            className="flex items-center text-sm font-bold text-gray-700 hover:bg-gray-100 px-2 py-1 rounded-lg transition"
          >
            {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            <span className="ml-1 text-[10px] text-[#2D7A71]">▼</span>
          </button>
          
          {!showYearSelector && (
            <div className="flex space-x-1">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600">
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        <div className="relative min-h-[240px]">
          {showYearSelector ? (
            /* Liste des années (Scrollable) */
            <div className="absolute inset-0 overflow-y-auto grid grid-cols-3 gap-2 p-2 bg-white max-h-[240px] scrollbar-hide">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => handleYearChange(y)}
                  className={`py-2 rounded-xl text-sm ${getYear(currentMonth) === y ? 'bg-[#2D7A71] text-white font-bold' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  {y}
                </button>
              ))}
            </div>
          ) : (
            /* Grille des jours */
            <>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
                  <span key={i} className="text-[11px] font-bold text-gray-300 h-8 flex items-center justify-center">
                    {d}
                  </span>
                ))}
                {days.map((day, i) => {
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        h-9 w-9 text-sm rounded-full flex items-center justify-center transition-all
                        ${!isCurrentMonth ? 'text-gray-200' : 'text-gray-600'}
                        ${isSelected ? 'bg-[#2D7A71] !text-white font-bold shadow-lg shadow-teal-100' : 'hover:bg-gray-50'}
                      `}
                    >
                      {format(day, 'd')}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end space-x-2 p-4 pt-0">
        <button 
          onClick={onClose}
          className="text-xs font-bold text-gray-400 hover:bg-gray-50 px-4 py-2 rounded-xl transition uppercase"
        >
          Annuler
        </button>
        <button 
          onClick={() => onSelect(selectedDate)}
          className="text-xs font-bold text-[#2D7A71] hover:bg-teal-50 px-4 py-2 rounded-xl transition uppercase"
        >
          Confirmer
        </button>
      </div>
    </div>
  );
};

export default CustomDatePicker;