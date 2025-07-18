// src/components/dashboard/AttendanceManager.js
'use client'

import { submitAttendance } from '@/app/dashboard/supervisor/actions'
import { useRef, useState, useTransition } from 'react'

// Radio Button Helper Component
const RadioButton = ({ laborId, value, label, peer, style, defaultChecked, disabled }) => (
    <div>
        <input 
            type="radio" 
            id={`att-${laborId}-${peer}`} 
            name={`attendance-${laborId}`} 
            value={value} 
            defaultChecked={defaultChecked}
            className={`hidden peer/${peer}`}
            disabled={disabled}
        />
        <label 
            htmlFor={`att-${laborId}-${peer}`} 
            className={`cursor-pointer px-3 py-1 text-sm rounded-full border transition-colors duration-200 ${style} ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : ''}`}
        >
            {label}
        </label>
    </div>
);

export default function AttendanceManager({ site, labors, alreadyMarkedLabors = {} }) {
  const formRef = useRef(null);
  const [message, setMessage] = useState(null);
  const [isPending, startTransition] = useTransition();
  const today = new Date().toISOString().split('T')[0];
  
  const isTodayAttendanceMarked = Object.keys(alreadyMarkedLabors).length > 0;

  const handleFormSubmit = (formData) => {
    setMessage(null);
    startTransition(async () => {
      const result = await submitAttendance(formData)
      setMessage(result)
      if (result?.success) {
        window.location.reload(); 
      }
      setTimeout(() => setMessage(null), 5000)
    })
  }

  if (!site) {
      return (
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold text-gray-800">Assignment Pending</h3>
            <p className="text-gray-600 mt-2">Please contact an admin.</p>
        </div>
      );
  }

  // YEH HAI NAYE OPTIONS, BILKUL ADMIN JAISE
  const attendanceOptions = [
      { label: 'Absent', value: 0, peer: 'absent', style: 'peer-checked/absent:bg-red-500 peer-checked/absent:text-white peer-checked/absent:border-red-500' },
      { label: 'Half (1/2)', value: 0.5, peer: 'half', style: 'peer-checked/half:bg-yellow-500 peer-checked/half:text-white peer-checked/half:border-yellow-500' },
      { label: 'Full (P)', value: 1, peer: 'full', style: 'peer-checked/full:bg-green-500 peer-checked/full:text-white peer-checked/full:border-green-500' },
      { label: 'Full+Half', value: 1.5, peer: 'onehalf', style: 'peer-checked/onehalf:bg-teal-500 peer-checked/onehalf:text-white peer-checked/onehalf:border-teal-500' },
      { label: 'Double', value: 2, peer: 'double', style: 'peer-checked/double:bg-indigo-500 peer-checked/double:text-white peer-checked/double:border-indigo-500' }
  ];

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
            <h3 className="text-xl font-bold">Daily Attendance</h3>
            <p className="text-sm text-gray-500">Site: <span className="font-semibold text-gray-800">{site.name}</span></p>
        </div>
        {isTodayAttendanceMarked && (
            <div className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">SUBMITTED</div>
        )}
      </div>

      <form ref={formRef} action={handleFormSubmit}>
        <input type="hidden" name="siteId" value={site.id} />
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Attendance Date</label>
          {/* Yeh form ke saath aaj ki date bhej dega, bina supervisor ko dikhaye */}
          <input type="hidden" name="attendanceDate" value={today} />
          {/* Yeh supervisor ko dikhane ke liye hai ki attendance aaj ki hai */}
          <p className="px-3 py-2 bg-gray-100 rounded-md text-gray-800 font-semibold w-fit">
          {new Date(today).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {!labors || labors.length === 0 ? (
           <div className="p-4 bg-gray-50 rounded-md text-gray-600 text-center">No active labors assigned.</div>
        ) : (
          <div className="space-y-4">
            {labors.map((labor) => (
              <div key={labor.id} className={`p-3 border rounded-md transition-colors ${isTodayAttendanceMarked ? 'bg-gray-50' : 'bg-white'}`}>
                <p className="font-semibold mb-2">{labor.full_name}</p>
                <fieldset className="flex flex-wrap gap-3">
                    {attendanceOptions.map(opt => (
                        <RadioButton 
                            key={opt.value}
                            laborId={labor.id} 
                            value={opt.value} 
                            label={opt.label} 
                            peer={opt.peer}
                            style={opt.style} 
                            defaultChecked={alreadyMarkedLabors[labor.id] === opt.value} 
                            disabled={isTodayAttendanceMarked} 
                        />
                    ))}
                </fieldset>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6">
            <button type="submit" disabled={isPending || isTodayAttendanceMarked || !labors || labors.length === 0} className="w-full sm:w-auto bg-slate-800 text-white font-bold py-3 px-8 rounded-lg disabled:bg-slate-400 disabled:cursor-not-allowed">
                {isPending ? 'Submitting...' : (isTodayAttendanceMarked ? 'Already Submitted' : 'Submit Attendance')}
            </button>
             {message && <p className={`mt-3 text-sm font-medium ${message.error ? 'text-red-600' : 'text-green-600'}`}>{message.error || message.success}</p>}
        </div>
      </form>
    </div>
  )
}