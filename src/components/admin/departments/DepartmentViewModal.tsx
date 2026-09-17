import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  MapPin,
  Users,
  Check,
  Edit2,
  Loader2,
  Info,
  Plus,
  UserMinus,
  ExternalLink,
  Calendar,
  Stethoscope,
  Phone,
  DollarSign,
  Power,
  Trash2
} from 'lucide-react';
import { AdminDepartment, AdminDoctor } from '../../../types';
import { DepartmentIcon } from './DepartmentIcon';
import { AVAILABLE_LOCATIONS } from '../../../data/departmentsData';

export type DepartmentModalTab = 'overview' | 'edit' | 'doctors';

interface DepartmentViewModalProps {
  department: AdminDepartment | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateDepartment: (dept: AdminDepartment) => Promise<void> | void;
  availableDoctors?: AdminDoctor[];
  initialTab?: DepartmentModalTab;
  onAssignDoctor?: (doctorId: string, departmentName: string) => Promise<void>;
  onRemoveDoctor?: (doctorId: string) => Promise<void>;
  onRemoveDoctorFromDept?: (doctorId: string) => Promise<void>;
  onToggleStatus?: (deptId: string) => Promise<void> | void;
  onDeleteDepartment?: (deptId: string) => void;
  onNavigateToDoctors?: () => void;
  onViewSchedule?: () => void;
}

export const DepartmentViewModal: React.FC<DepartmentViewModalProps> = ({
  department,
  isOpen,
  onClose,
  onUpdateDepartment,
  availableDoctors = [],
  initialTab = 'overview',
  onAssignDoctor,
  onRemoveDoctor,
  onRemoveDoctorFromDept,
  onToggleStatus,
  onDeleteDepartment,
  onNavigateToDoctors,
  onViewSchedule,
}) => {
  const [activeTab, setActiveTab] = useState<DepartmentModalTab>(initialTab);
  const [name, setName] = useState(department?.name || '');
  const [description, setDescription] = useState(department?.description || '');
  const [headDoctorId, setHeadDoctorId] = useState(department?.headDoctor?.id || '');
  const [customDocName, setCustomDocName] = useState(
    department?.headDoctor?.name && department.headDoctor.name !== 'To Be Assigned'
      ? department.headDoctor.name
      : ''
  );
  const [customDocRole, setCustomDocRole] = useState(department?.headDoctor?.role || '');
  const [location, setLocation] = useState(department?.consultationLocation || '');
  const [status, setStatus] = useState<'Active' | 'Inactive'>(department?.status || 'Active');
  const [isSaving, setIsSaving] = useState(false);

  // Doctors management state
  const [selectedDoctorToAssign, setSelectedDoctorToAssign] = useState<string>('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [actionDoctorId, setActionDoctorId] = useState<string | null>(null);

  // Effective remove handler (supports both prop names)
  const removeDoctorHandler = onRemoveDoctor || onRemoveDoctorFromDept;

  // Sync state whenever department prop changes or opens
  useEffect(() => {
    if (department && isOpen) {
      setName(department.name || '');
      setDescription(department.description || '');
      setHeadDoctorId(department.headDoctor?.id || '');
      setCustomDocName(
        department.headDoctor?.name && department.headDoctor.name !== 'To Be Assigned'
          ? department.headDoctor.name
          : ''
      );
      setCustomDocRole(department.headDoctor?.role || '');
      setLocation(department.consultationLocation || '');
      setStatus(department.status || 'Active');
      setActiveTab(initialTab || 'overview');
      setSelectedDoctorToAssign('');
    }
  }, [department, isOpen, initialTab]);

  if (!isOpen || !department) return null;

  // Check if doctor is assigned to this department
  const isDocAssignedToThisDept = (d: AdminDoctor) => {
    const docDeptNorm = (d.department || '').trim().toLowerCase();
    const curDeptNorm = (department.name || '').trim().toLowerCase();
    const isDeptNameMatch = docDeptNorm.length > 0 && docDeptNorm === curDeptNorm;
    const isDeptIdMatch = Boolean(department.id && d.departmentId && d.departmentId === department.id);
    const isHeadDoc = Boolean(
      department.headDoctor?.id &&
      department.headDoctor.id !== 'unassigned' &&
      department.headDoctor.id === d.id
    );
    return isDeptNameMatch || isDeptIdMatch || isHeadDoc;
  };

  // Filter doctors assigned to this department
  const assignedDoctors = availableDoctors.filter(isDocAssignedToThisDept);

  // Doctors available to be assigned to this department (unassigned or currently in another department)
  const unassignedOrOtherDoctors = availableDoctors.filter((d) => !isDocAssignedToThisDept(d));

  const handleSave = async () => {
    let resolvedDoc: AdminDepartment['headDoctor'];

    if (headDoctorId === 'custom') {
      resolvedDoc = {
        id: `doc-${Date.now()}`,
        name: customDocName.trim() || 'Head Specialist',
        role: customDocRole.trim() || 'Department Lead',
      };
    } else if (headDoctorId === 'unassigned') {
      resolvedDoc = {
        id: 'unassigned',
        name: 'To Be Assigned',
        role: 'Pending Assignment',
      };
    } else {
      const liveDoc = availableDoctors.find((d) => d.id === headDoctorId);
      if (liveDoc) {
        resolvedDoc = {
          id: liveDoc.id,
          name: liveDoc.name,
          role: liveDoc.specialty || 'Head Doctor',
          avatar: liveDoc.avatar || liveDoc.imageUrl,
        };
      } else {
        resolvedDoc = department.headDoctor || {
          id: 'unassigned',
          name: 'To Be Assigned',
          role: 'Pending Assignment',
        };
      }
    }

    setIsSaving(true);
    try {
      await onUpdateDepartment({
        ...department,
        name: name.trim() || department.name,
        description: description.trim() || department.description,
        headDoctor: resolvedDoc,
        consultationLocation: location,
        status,
      });
      setActiveTab('overview');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAssignSelectedDoctor = async () => {
    if (!selectedDoctorToAssign || !onAssignDoctor) return;
    setIsAssigning(true);
    try {
      await onAssignDoctor(selectedDoctorToAssign, department.name);
      setSelectedDoctorToAssign('');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveAssignedDoctor = async (doctorId: string) => {
    if (!removeDoctorHandler) return;
    setActionDoctorId(doctorId);
    try {
      await removeDoctorHandler(doctorId);
    } finally {
      setActionDoctorId(null);
    }
  };

  const headDocInitial = (department.headDoctor?.name || 'D').charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-[20px] border border-[#DCEBFA] shadow-[0_20px_50px_rgba(13,40,87,0.18)] max-w-xl w-full overflow-hidden text-left flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E1EDF9] flex items-center justify-between bg-[#F8FBFF] shrink-0">
          <div className="flex items-center gap-3">
            <DepartmentIcon
              type={department.iconType}
              bgTint={department.bgTint}
              iconColor={department.iconColor}
              size="md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] font-bold text-[#0D2857]">
                  {department.name}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                    department.status === 'Active'
                      ? 'bg-[#E7F9F0] text-[#18B978]'
                      : 'bg-[#F1F5F9] text-[#64748B]'
                  }`}
                >
                  {department.status}
                </span>
                {onToggleStatus && (
                  <button
                    type="button"
                    onClick={() => onToggleStatus(department.id)}
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-[6px] transition-colors flex items-center gap-1 cursor-pointer border ${
                      department.status === 'Active'
                        ? 'text-[#DC2626] bg-[#FEF2F2] border-[#FECACA] hover:bg-[#FEE2E2]'
                        : 'text-[#18B978] bg-[#E7F9F0] border-[#A7F3D0] hover:bg-[#D1FAE5]'
                    }`}
                    title={`Click to ${department.status === 'Active' ? 'deactivate' : 'activate'} this department`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{department.status === 'Active' ? 'Deactivate' : 'Activate'}</span>
                  </button>
                )}
              </div>
              <p className="text-[12px] text-[#5273A8]">
                Department Overview & Staff Management
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5273A8] hover:bg-[#EAF4FF] hover:text-[#0D2857] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E1EDF9] bg-[#FDFEFE] px-6 gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3.5 text-[13px] font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#0868F5] text-[#0868F5]'
                : 'border-transparent text-[#5273A8] hover:text-[#0D2857]'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`py-3 px-3.5 text-[13px] font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'edit'
                ? 'border-[#0868F5] text-[#0868F5]'
                : 'border-transparent text-[#5273A8] hover:text-[#0D2857]'
            }`}
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Department</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('doctors')}
            className={`py-3 px-3.5 text-[13px] font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'doctors'
                ? 'border-[#0868F5] text-[#0868F5]'
                : 'border-transparent text-[#5273A8] hover:text-[#0D2857]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Manage Doctors</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                activeTab === 'doctors'
                  ? 'bg-[#0868F5] text-white'
                  : 'bg-[#EAF4FF] text-[#0868F5]'
              }`}
            >
              {assignedDoctors.length}
            </span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 [scrollbar-width:thin]">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-[#F8FBFF] p-4 rounded-[14px] border border-[#E1EDF9]">
                <div className="text-[12px] font-medium text-[#5273A8]">Description</div>
                <div className="text-[13.5px] text-[#0D2857] mt-1 leading-relaxed">
                  {department.description || 'No description provided.'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-[12px] bg-[#F5FAFF] border border-[#E1EDF9]">
                  <div className="flex items-center gap-1.5 text-[11.5px] text-[#5273A8] font-medium mb-1">
                    <User className="w-3.5 h-3.5 text-[#0868F5]" />
                    <span>Head of Department</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {department.headDoctor?.avatar ? (
                      <img
                        src={department.headDoctor.avatar}
                        alt={department.headDoctor.name}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full object-cover border border-[#DCEBFA]"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#EAF4FF] text-[#0868F5] font-bold text-[12px] flex items-center justify-center border border-[#DCEBFA]">
                        {headDocInitial}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-[#0D2857] leading-tight truncate">
                        {department.headDoctor?.name || 'Unassigned'}
                      </p>
                      <p className="text-[11px] text-[#5273A8] truncate">
                        {department.headDoctor?.role || 'Department Specialist'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-[12px] bg-[#F5FAFF] border border-[#E1EDF9]">
                  <div className="flex items-center gap-1.5 text-[11.5px] text-[#5273A8] font-medium mb-1">
                    <Users className="w-3.5 h-3.5 text-[#0868F5]" />
                    <span>Total Staff</span>
                  </div>
                  <p className="text-[18px] font-bold text-[#0D2857] mt-1">
                    {assignedDoctors.length || department.totalDoctors || 0}{' '}
                    <span className="text-[12px] font-normal text-[#5273A8]">Specialists</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('doctors')}
                    className="mt-1 text-[11.5px] font-bold text-[#0868F5] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Manage Roster</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {department.consultationLocation && (
                <div className="p-3.5 rounded-[12px] bg-[#F8FBFF] border border-[#E1EDF9] flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#0868F5] shrink-0" />
                  <div>
                    <div className="text-[11.5px] text-[#5273A8] font-medium">
                      Consultation Location
                    </div>
                    <div className="text-[13px] font-semibold text-[#0D2857]">
                      {department.consultationLocation}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions inside modal */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className="px-3.5 py-2 rounded-[8px] bg-[#EAF4FF] hover:bg-[#D8ECFE] text-[#0868F5] text-[12.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Department Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('doctors')}
                  className="px-3.5 py-2 rounded-[8px] bg-[#F0F6FE] hover:bg-[#DCEBFA] text-[#0D2857] text-[12.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-[#0868F5]" />
                  <span>Manage Assigned Doctors ({assignedDoctors.length})</span>
                </button>
                {onViewSchedule && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onViewSchedule();
                    }}
                    className="px-3.5 py-2 rounded-[8px] bg-[#F5FAFF] hover:bg-[#E8F1FB] text-[#5273A8] hover:text-[#0D2857] text-[12.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-[#DCEBFA]"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>View Schedules</span>
                  </button>
                )}

                {onToggleStatus && (
                  <button
                    type="button"
                    onClick={() => onToggleStatus(department.id)}
                    className={`px-3.5 py-2 rounded-[8px] text-[12.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      department.status === 'Active'
                        ? 'bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626]'
                        : 'bg-[#E7F9F0] hover:bg-[#D1FAE5] text-[#059669]'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{department.status === 'Active' ? 'Deactivate Department' : 'Activate Department'}</span>
                  </button>
                )}

                {onDeleteDepartment && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onDeleteDepartment(department.id);
                    }}
                    className="px-3.5 py-2 rounded-[8px] bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] text-[12.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Department</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: EDIT DEPARTMENT */}
          {activeTab === 'edit' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1">
                  Department Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cardiology"
                  className="w-full h-[40px] px-3.5 border border-[#DCEBFA] rounded-[10px] text-[13.5px] text-[#0D2857] focus:outline-none focus:border-[#0868F5] focus:ring-2 focus:ring-[#0868F5]/10"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief clinical description of services offered..."
                  className="w-full p-3 border border-[#DCEBFA] rounded-[10px] text-[13.5px] text-[#0D2857] leading-relaxed focus:outline-none focus:border-[#0868F5] focus:ring-2 focus:ring-[#0868F5]/10"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1">
                  Head Doctor
                </label>
                <select
                  value={headDoctorId}
                  onChange={(e) => setHeadDoctorId(e.target.value)}
                  className="w-full h-[40px] px-3 border border-[#DCEBFA] rounded-[10px] text-[13.5px] text-[#0D2857] focus:outline-none focus:border-[#0868F5] cursor-pointer"
                >
                  <option value="unassigned">To Be Assigned</option>
                  {availableDoctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.specialty || doc.department})
                    </option>
                  ))}
                  <option value="custom">+ Custom Doctor Details</option>
                </select>

                {headDoctorId === 'custom' && (
                  <div className="mt-2 space-y-2 p-3 bg-[#F5FAFF] border border-[#DCEBFA] rounded-[10px]">
                    <input
                      type="text"
                      placeholder="Doctor Full Name"
                      value={customDocName}
                      onChange={(e) => setCustomDocName(e.target.value)}
                      className="w-full h-[36px] px-3 bg-white border border-[#DCEBFA] rounded-[8px] text-[13px] text-[#0D2857]"
                    />
                    <input
                      type="text"
                      placeholder="Role / Title (e.g. Chief of Cardiology)"
                      value={customDocRole}
                      onChange={(e) => setCustomDocRole(e.target.value)}
                      className="w-full h-[36px] px-3 bg-white border border-[#DCEBFA] rounded-[8px] text-[13px] text-[#0D2857]"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1">
                  Consultation Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Building A - 1st Floor"
                  list="dept-locations-list"
                  className="w-full h-[40px] px-3.5 border border-[#DCEBFA] rounded-[10px] text-[13.5px] text-[#0D2857] focus:outline-none focus:border-[#0868F5]"
                />
                <datalist id="dept-locations-list">
                  {AVAILABLE_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1">
                  Department Status
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('Active')}
                    className={`px-4 py-2 rounded-[8px] text-[13px] font-semibold cursor-pointer transition-colors ${
                      status === 'Active'
                        ? 'bg-[#0868F5] text-white shadow-2xs'
                        : 'bg-[#F0F5FA] text-[#5273A8] hover:bg-[#E8F1FB]'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('Inactive')}
                    className={`px-4 py-2 rounded-[8px] text-[13px] font-semibold cursor-pointer transition-colors ${
                      status === 'Inactive'
                        ? 'bg-[#0868F5] text-white shadow-2xs'
                        : 'bg-[#F0F5FA] text-[#5273A8] hover:bg-[#E8F1FB]'
                    }`}
                  >
                    Inactive
                  </button>
                </div>
              </div>

              {/* Department Controls & Danger Zone */}
              <div className="pt-4 border-t border-[#F1F6FC] mt-4 space-y-3">
                <div className="text-[12px] font-bold text-[#DC2626] uppercase tracking-wider">
                  Department Controls
                </div>

                <div className="p-3.5 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-[13px] font-bold text-[#0D2857]">
                      {department.status === 'Active' ? 'Deactivate Department' : 'Activate Department'}
                    </div>
                    <div className="text-[11.5px] text-[#5273A8] mt-0.5">
                      {department.status === 'Active'
                        ? 'Temporarily disable consultations and booking for this department.'
                        : 'Re-enable this department to accept consultations and active rosters.'}
                    </div>
                  </div>
                  {onToggleStatus && (
                    <button
                      type="button"
                      onClick={() => onToggleStatus(department.id)}
                      className={`px-3.5 py-1.5 rounded-[8px] text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                        department.status === 'Active'
                          ? 'bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]'
                          : 'bg-[#E7F9F0] hover:bg-[#D1FAE5] text-[#059669] border border-[#A7F3D0]'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{department.status === 'Active' ? 'Deactivate' : 'Activate'}</span>
                    </button>
                  )}
                </div>

                <div className="p-3.5 rounded-[12px] bg-[#FEF2F2]/60 border border-[#FECACA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-[13px] font-bold text-[#991B1B]">
                      Delete Department Permanently
                    </div>
                    <div className="text-[11.5px] text-[#B91C1C] mt-0.5">
                      Remove this department from hospital records and unassign associated specialists.
                    </div>
                  </div>
                  {onDeleteDepartment && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onDeleteDepartment(department.id);
                      }}
                      className="px-3.5 py-1.5 rounded-[8px] bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Department</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MANAGE DOCTORS */}
          {activeTab === 'doctors' && (
            <div className="space-y-4">
              {/* Top Banner: Assign New Doctor */}
              <div className="p-3.5 rounded-[14px] bg-[#F5FAFF] border border-[#DCEBFA] space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-[13px] font-bold text-[#0D2857] flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-[#0868F5]" />
                    <span>Assign Doctor to {department.name}</span>
                  </h4>
                  {onNavigateToDoctors && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateToDoctors();
                      }}
                      className="text-[12px] font-semibold text-[#0868F5] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Doctors Directory</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <select
                    value={selectedDoctorToAssign}
                    onChange={(e) => setSelectedDoctorToAssign(e.target.value)}
                    className="flex-1 h-[38px] px-3 bg-white border border-[#DCEBFA] rounded-[8px] text-[13px] text-[#0D2857] focus:outline-none focus:border-[#0868F5] cursor-pointer"
                  >
                    <option value="">Select a doctor from other departments...</option>
                    {unassignedOrOtherDoctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} ({doc.specialty} — Currently: {doc.department || 'Unassigned'})
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleAssignSelectedDoctor}
                    disabled={!selectedDoctorToAssign || isAssigning}
                    className="h-[38px] px-4 bg-[#0868F5] hover:bg-[#075edc] disabled:opacity-50 text-white text-[12.5px] font-semibold rounded-[8px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
                  >
                    {isAssigning ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                    <span>Assign</span>
                  </button>
                </div>
              </div>

              {/* Roster List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[13px] font-bold text-[#0D2857]">
                    Assigned Medical Specialists ({assignedDoctors.length})
                  </h4>
                  <span className="text-[11.5px] text-[#5273A8]">
                    Primary department affiliation
                  </span>
                </div>

                {assignedDoctors.length === 0 ? (
                  <div className="py-8 text-center bg-[#FBFDFF] rounded-[12px] border border-dashed border-[#DCEBFA] p-6">
                    <Stethoscope className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                    <p className="text-[13.5px] font-bold text-[#0D2857]">
                      No doctors assigned yet
                    </p>
                    <p className="text-[12px] text-[#5273A8] mt-0.5 max-w-sm mx-auto">
                      Use the selector above to assign registered specialists to {department.name}.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                    {assignedDoctors.map((doc) => {
                      const isHead = department.headDoctor?.id === doc.id;
                      const isActing = actionDoctorId === doc.id;
                      const initial = (doc.name || 'D').replace(/^Dr\.\s*/i, '').charAt(0).toUpperCase();

                      return (
                        <div
                          key={doc.id}
                          className="p-3 rounded-[12px] bg-white border border-[#E1EDF9] hover:border-[#BEDCF9] transition-all flex items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {doc.imageUrl ? (
                              <img
                                src={doc.imageUrl}
                                alt={doc.name}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-full object-cover border border-[#DCEBFA] shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-[#EAF4FF] text-[#0868F5] font-bold text-[13px] flex items-center justify-center border border-[#DCEBFA] shrink-0">
                                {initial}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[13.5px] font-bold text-[#0D2857] truncate">
                                  {doc.name}
                                </span>
                                {isHead && (
                                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#EAF4FF] text-[#0868F5]">
                                    Head Doctor
                                  </span>
                                )}
                                <span
                                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                                    doc.status === 'Active'
                                      ? 'bg-[#E7F9F0] text-[#18B978]'
                                      : 'bg-[#F1F5F9] text-[#64748B]'
                                  }`}
                                >
                                  {doc.status}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-[11.5px] text-[#5273A8] mt-0.5">
                                <span>{doc.specialty || 'Specialist'}</span>
                                {doc.feeText && (
                                  <>
                                    <span>•</span>
                                    <span>{doc.feeText}</span>
                                  </>
                                )}
                                {doc.phone && (
                                  <>
                                    <span>•</span>
                                    <span className="flex items-center gap-0.5">
                                      <Phone className="w-3 h-3" />
                                      {doc.phone}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {removeDoctorHandler && (
                              <button
                                type="button"
                                onClick={() => handleRemoveAssignedDoctor(doc.id)}
                                disabled={isActing}
                                className="px-2.5 py-1.5 rounded-[8px] text-[11.5px] font-semibold text-[#EF4444] hover:bg-[#FEF2F2] border border-[#FCA5A5]/30 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                title={`Unassign ${doc.name} from ${department.name}`}
                              >
                                {isActing ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <UserMinus className="w-3.5 h-3.5" />
                                )}
                                <span className="hidden sm:inline">Unassign</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#F8FBFF] border-t border-[#E1EDF9] flex items-center justify-between shrink-0">
          {activeTab === 'edit' ? (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                disabled={isSaving}
                className="px-4 py-2 rounded-[8px] text-[13px] font-semibold text-[#5273A8] hover:bg-[#EAF4FF] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 rounded-[8px] bg-[#0868F5] hover:bg-[#075edc] disabled:opacity-60 text-white text-[13px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </>
          ) : activeTab === 'doctors' ? (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="px-4 py-2 rounded-[8px] text-[13px] font-semibold text-[#5273A8] hover:bg-[#EAF4FF] transition-colors cursor-pointer"
              >
                Back to Overview
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-[8px] bg-[#0868F5] hover:bg-[#075edc] text-white text-[13px] font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                Done
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className="px-3.5 py-1.5 rounded-[8px] bg-[#EAF4FF] hover:bg-[#D8ECFE] text-[#0868F5] text-[12.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Department</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('doctors')}
                  className="px-3.5 py-1.5 rounded-[8px] bg-[#F0F6FE] hover:bg-[#DCEBFA] text-[#0D2857] text-[12.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-[#0868F5]" />
                  <span>Manage Doctors</span>
                </button>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-[8px] bg-[#0868F5] hover:bg-[#075edc] text-white text-[13px] font-semibold transition-colors cursor-pointer shadow-2xs"
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

