// src/pages/supervisor/SupervisorMachinesPage.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaTasks,
  FaExchangeAlt,
  FaUserPlus,
  FaTruckMoving,
} from "react-icons/fa"; // FaTruckMoving for transfer
import Modal from "../../components/common/Modal";

const SupervisorMachinesPage = () => {
  const [searchParams] = useSearchParams();
  const initialAction = searchParams.get("action");

  const [machines, setMachines] = useState([
    {
      id: "M001",
      name: "Excavator XG-2000",
      type: "Heavy Duty",
      site: "Site A",
      status: "Active",
      assignedTo: "John Doe",
      lastMaintenance: "2024-05-01",
      nextMaintenance: "2024-11-01",
    },
    {
      id: "M002",
      name: "Crane LFT-500",
      type: "Lifting",
      site: "Site B",
      status: "Active",
      assignedTo: "-",
      lastMaintenance: "2024-03-15",
      nextMaintenance: "2024-09-15",
    },
    {
      id: "M003",
      name: "Bulldozer BD-150",
      type: "Earth Moving",
      site: "Site A",
      status: "Retired",
      assignedTo: "-",
      lastMaintenance: "2023-10-20",
      nextMaintenance: "N/A",
    },
    {
      id: "M004",
      name: "Generator GEN-50KVA",
      type: "Power",
      site: "Site C",
      status: "Active",
      assignedTo: "SubTeam Alpha",
      lastMaintenance: "2024-04-10",
      nextMaintenance: "2024-10-10",
    },
    {
      id: "M005",
      name: "Road Roller RR-10T",
      type: "Compaction",
      site: "Site B",
      status: "Under Maintenance",
      assignedTo: "Workshop",
      lastMaintenance: "2024-05-20",
      nextMaintenance: "2024-06-05",
    },
  ]);

  const [filteredMachines, setFilteredMachines] = useState(machines);
  const [searchTerm, setSearchTerm] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // State for "Request Machine from Other Site" Modal (General Request)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestMachineData, setRequestMachineData] = useState({
    machineType: "",
    requiredSite: "",
    justification: "",
    requiredDate: "",
  });

  // State for "Assign Machine" Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [machineToAssign, setMachineToAssign] = useState(null);
  const [assignMachineFormData, setAssignMachineFormData] = useState({
    laborerOrSubcontractor: "",
    assignmentDate: new Date().toISOString().split("T")[0],
    expectedReturnDate: "",
  });

  // State for "Request Specific Machine Transfer" Modal
  const [isSpecificTransferModalOpen, setIsSpecificTransferModalOpen] =
    useState(false);
  const [machineToRequestTransfer, setMachineToRequestTransfer] =
    useState(null); // Machine object for specific transfer
  const [specificTransferFormData, setSpecificTransferFormData] = useState({
    transferToSite: "",
    requiredByDate: new Date().toISOString().split("T")[0],
    justification: "",
  });

  const mockLaborers = [
    { id: "L001", name: "John Doe (Laborer)" },
    { id: "L002", name: "Jane Smith (Laborer)" },
    { id: "S001", name: "ConstructCo (Subcontractor)" },
    { id: "L003", name: "Mike Brown (Laborer)" },
  ];
  const allSites = ["Site A", "Site B", "Site C", "Central Store", "Workshop"];

  useEffect(() => {
    if (initialAction === "request") {
      setIsRequestModalOpen(true);
    } else if (initialAction === "assign" && machines.length > 0) {
      const firstAssignable = machines.find(
        (m) => m.status === "Active" && m.assignedTo === "-"
      );
      if (firstAssignable) {
        handleOpenAssignModal(firstAssignable);
      } else {
        // alert("Quick assign action: No machines currently available for assignment.");
      }
    }
  }, [initialAction, machines]);

  useEffect(() => {
    let currentMachines = [...machines];
    if (searchTerm) {
      currentMachines = currentMachines.filter(
        (m) =>
          m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (siteFilter) {
      currentMachines = currentMachines.filter((m) => m.site === siteFilter);
    }
    if (statusFilter) {
      currentMachines = currentMachines.filter(
        (m) => m.status === statusFilter
      );
    }
    setFilteredMachines(currentMachines);
  }, [searchTerm, siteFilter, statusFilter, machines]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Active":
        return "badge-success";
      case "Broken":
        return "badge-error";
      case "Retired":
        return "badge-ghost";
      case "Under Maintenance":
        return "badge-warning";
      default:
        return "badge-neutral";
    }
  };

  const handleRequestModalInputChange = (e) => {
    const { name, value } = e.target;
    setRequestMachineData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmitMachineRequest = (e) => {
    e.preventDefault();
    console.log("Submitting general machine request:", requestMachineData);
    alert(
      `General machine request submitted for ${requestMachineData.machineType} at ${requestMachineData.requiredSite}.`
    );
    setIsRequestModalOpen(false);
    setRequestMachineData({
      machineType: "",
      requiredSite: "",
      justification: "",
      requiredDate: "",
    });
  };

  const handleOpenAssignModal = (machine) => {
    setMachineToAssign(machine);
    setAssignMachineFormData({
      laborerOrSubcontractor: "",
      assignmentDate: new Date().toISOString().split("T")[0],
      expectedReturnDate: "",
    });
    setIsAssignModalOpen(true);
  };
  const handleAssignModalInputChange = (e) => {
    const { name, value } = e.target;
    setAssignMachineFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmitMachineAssignment = (e) => {
    e.preventDefault();
    console.log(
      "Assigning Machine:",
      machineToAssign?.id,
      "to",
      assignMachineFormData.laborerOrSubcontractor,
      "Data:",
      assignMachineFormData
    );
    alert(
      `Machine ${machineToAssign?.name} assigned to ${assignMachineFormData.laborerOrSubcontractor}.`
    );
    setMachines((prevMachines) =>
      prevMachines.map((m) =>
        m.id === machineToAssign?.id
          ? {
              ...m,
              assignedTo: assignMachineFormData.laborerOrSubcontractor,
              status: "Active",
            }
          : m
      )
    );
    setIsAssignModalOpen(false);
    setMachineToAssign(null);
  };

  // --- Specific Machine Transfer Request Modal Logic ---
  const handleOpenSpecificTransferModal = (machine) => {
    setMachineToRequestTransfer(machine);
    setSpecificTransferFormData({
      transferToSite: "",
      requiredByDate: new Date().toISOString().split("T")[0],
      justification: "",
    });
    setIsSpecificTransferModalOpen(true);
  };

  const handleSpecificTransferModalInputChange = (e) => {
    const { name, value } = e.target;
    setSpecificTransferFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitSpecificMachineTransfer = (e) => {
    e.preventDefault();
    console.log(
      "Submitting specific transfer request for Machine:",
      machineToRequestTransfer?.id,
      "to site:",
      specificTransferFormData.transferToSite,
      "Data:",
      specificTransferFormData
    );
    alert(
      `Transfer request for ${machineToRequestTransfer?.name} to site ${specificTransferFormData.transferToSite} submitted.`
    );
    // TODO: Update machine status locally (e.g., to 'Transfer Requested') and call API / dispatch Redux action
    // setMachines(prevMachines => prevMachines.map(m =>
    //     m.id === machineToRequestTransfer?.id ? { ...m, status: 'Transfer Requested' } : m
    // ));
    setIsSpecificTransferModalOpen(false);
    setMachineToRequestTransfer(null);
  };

  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="card-title text-2xl text-primary mb-4 sm:mb-0">
              Machine Management (Supervisor)
            </h2>
            <button
              className="btn btn-primary btn-sm sm:btn-md"
              onClick={() => setIsRequestModalOpen(true)}
            >
              <FaPlus className="mr-2" />
              Request Machine (General)
            </button>
          </div>

          {/* Filters Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-4 bg-base-200 rounded-lg">
            <div className="form-control">
              <label className="label pb-1 pt-0">
                <span className="label-text">Search Machine</span>
              </label>
              <div className="join w-full">
                <input
                  type="text"
                  placeholder="ID, Name, Type..."
                  className="input input-bordered join-item w-full focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-ghost join-item">
                  <FaSearch />
                </button>
              </div>
            </div>
            <div className="form-control">
              <label className="label pb-1 pt-0">
                <span className="label-text">Filter by Site</span>
              </label>
              <select
                className="select select-bordered w-full focus:border-primary"
                value={siteFilter}
                onChange={(e) => setSiteFilter(e.target.value)}
              >
                <option value="">All Sites</option>
                <option value="Site A">Site A</option>
                <option value="Site B">Site B</option>
                <option value="Site C">Site C</option>
                <option value="Central Store">Central Store</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label pb-1 pt-0">
                <span className="label-text">Filter by Status</span>
              </label>
              <select
                className="select select-bordered w-full focus:border-primary"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Broken">Broken</option>
                <option value="Retired">Retired</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </select>
            </div>
          </div>

          {/* Machines Table - Updated Transfer button */}
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name / Type</th>
                  <th>Site</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Next Maintenance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMachines.length > 0 ? (
                  filteredMachines.map((machine) => (
                    <tr key={machine.id} className="hover">
                      <td className="font-semibold text-primary">
                        {machine.id}
                      </td>
                      <td>
                        <div>{machine.name}</div>
                        <div className="text-xs opacity-70">{machine.type}</div>
                      </td>
                      <td>{machine.site}</td>
                      <td>
                        <span
                          className={`badge ${getStatusClass(
                            machine.status
                          )} badge-sm`}
                        >
                          {machine.status}
                        </span>
                      </td>
                      <td>{machine.assignedTo}</td>
                      <td>{machine.nextMaintenance}</td>
                      <td className="space-x-1 whitespace-nowrap">
                        <button
                          className="btn btn-xs btn-outline btn-info disabled:opacity-50"
                          onClick={() => handleOpenAssignModal(machine)}
                          disabled={
                            machine.status !== "Active" ||
                            machine.assignedTo !== "-"
                          }
                          title="Assign Machine"
                        >
                          <FaUserPlus /> Assign
                        </button>
                        <button
                          className="btn btn-xs btn-outline btn-warning disabled:opacity-50"
                          onClick={() =>
                            handleOpenSpecificTransferModal(machine)
                          } // Updated handler
                          disabled={
                            machine.status === "Retired" ||
                            machine.status === "Broken"
                          }
                          title="Request Transfer for this Machine"
                        >
                          <FaTruckMoving /> Transfer
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-4">
                      No machines found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Request Machine Modal (General) */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Request Machine from Other Site"
      >
        <form onSubmit={handleSubmitMachineRequest} className="space-y-4">
          {/* ... Form content from previous step ... */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Machine Type/Name</span>
            </label>
            <input
              type="text"
              name="machineType"
              value={requestMachineData.machineType}
              onChange={handleRequestModalInputChange}
              placeholder="e.g., Excavator, Crane LFT-500"
              className="input input-bordered w-full focus:border-primary"
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Required At Site</span>
            </label>
            <select
              name="requiredSite"
              value={requestMachineData.requiredSite}
              onChange={handleRequestModalInputChange}
              className="select select-bordered w-full focus:border-primary"
              required
            >
              <option value="" disabled>
                Select site
              </option>
              <option value="Site A">Site A</option>
              <option value="Site B">Site B</option>
              <option value="Site C">Site C</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Required By Date</span>
            </label>
            <input
              type="date"
              name="requiredDate"
              value={requestMachineData.requiredDate}
              onChange={handleRequestModalInputChange}
              className="input input-bordered w-full focus:border-primary"
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Justification/Reason</span>
            </label>
            <textarea
              name="justification"
              value={requestMachineData.justification}
              onChange={handleRequestModalInputChange}
              className="textarea textarea-bordered w-full h-24 focus:border-primary"
              placeholder="Briefly explain why this machine is needed"
              required
            ></textarea>
          </div>
          <div className="modal-action mt-6">
            <button
              type="button"
              onClick={() => setIsRequestModalOpen(false)}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Submit Request
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign Machine Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={`Assign Machine: ${machineToAssign?.name || ""}`}
      >
        <form onSubmit={handleSubmitMachineAssignment} className="space-y-4">
          {/* ... Form content from previous step ... */}
          {machineToAssign && (
            <div className="p-3 bg-base-200 rounded-md text-sm">
              {" "}
              <p>
                <strong>Machine ID:</strong> {machineToAssign.id}
              </p>{" "}
              <p>
                <strong>Type:</strong> {machineToAssign.type}
              </p>{" "}
              <p>
                <strong>Current Site:</strong> {machineToAssign.site}
              </p>{" "}
            </div>
          )}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Assign To (Laborer/Subcontractor)
              </span>
            </label>
            <select
              name="laborerOrSubcontractor"
              value={assignMachineFormData.laborerOrSubcontractor}
              onChange={handleAssignModalInputChange}
              className="select select-bordered w-full focus:border-primary"
              required
            >
              <option value="" disabled>
                Select assignee
              </option>
              {mockLaborers.map((l) => (
                <option key={l.id} value={l.name}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Assignment Date</span>
              </label>
              <input
                type="date"
                name="assignmentDate"
                value={assignMachineFormData.assignmentDate}
                onChange={handleAssignModalInputChange}
                className="input input-bordered w-full focus:border-primary"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Expected Return Date (Optional)
                </span>
              </label>
              <input
                type="date"
                name="expectedReturnDate"
                value={assignMachineFormData.expectedReturnDate}
                onChange={handleAssignModalInputChange}
                className="input input-bordered w-full focus:border-primary"
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Notes/Remarks (Optional)</span>
            </label>
            <textarea
              name="assignmentNotes"
              onChange={handleAssignModalInputChange}
              className="textarea textarea-bordered w-full h-20 focus:border-primary"
              placeholder="Any specific instructions or notes for this assignment"
            ></textarea>
          </div>
          <div className="modal-action mt-6">
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm Assignment
            </button>
          </div>
        </form>
      </Modal>

      {/* Request Specific Machine Transfer Modal */}
      <Modal
        isOpen={isSpecificTransferModalOpen}
        onClose={() => setIsSpecificTransferModalOpen(false)}
        title={`Request Transfer for: ${machineToRequestTransfer?.name || ""}`}
        size="max-w-xl" // Slightly larger modal if needed
      >
        <form
          onSubmit={handleSubmitSpecificMachineTransfer}
          className="space-y-4"
        >
          {machineToRequestTransfer && (
            <div className="p-4 bg-base-200 rounded-box text-sm space-y-1 mb-4">
              <p>
                <strong>Machine ID:</strong>{" "}
                <span className="font-mono text-accent">
                  {machineToRequestTransfer.id}
                </span>
              </p>
              <p>
                <strong>Type:</strong> {machineToRequestTransfer.type}
              </p>
              <p>
                <strong>Current Status:</strong>{" "}
                <span
                  className={`badge ${getStatusClass(
                    machineToRequestTransfer.status
                  )} badge-sm`}
                >
                  {machineToRequestTransfer.status}
                </span>
              </p>
              <p>
                <strong>Current Site:</strong>{" "}
                <span className="font-semibold">
                  {machineToRequestTransfer.site}
                </span>
              </p>
            </div>
          )}
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Transfer To Site <span className="text-error">*</span>
              </span>
            </label>
            <select
              name="transferToSite"
              value={specificTransferFormData.transferToSite}
              onChange={handleSpecificTransferModalInputChange}
              className="select select-bordered w-full focus:border-primary"
              required
            >
              <option value="" disabled>
                Select destination site...
              </option>
              {allSites
                .filter((site) => site !== machineToRequestTransfer?.site) // Exclude current site
                .map((site) => (
                  <option key={site} value={site}>
                    {site}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Required By Date <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="date"
              name="requiredByDate"
              value={specificTransferFormData.requiredByDate}
              onChange={handleSpecificTransferModalInputChange}
              className="input input-bordered w-full focus:border-primary"
              required
              min={new Date().toISOString().split("T")[0]} // Cannot request for past dates
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                Justification/Reason for Transfer{" "}
                <span className="text-error">*</span>
              </span>
            </label>
            <textarea
              name="justification"
              value={specificTransferFormData.justification}
              onChange={handleSpecificTransferModalInputChange}
              className="textarea textarea-bordered w-full h-24 focus:border-primary"
              placeholder="Explain why this transfer is needed for this specific machine"
              required
            ></textarea>
          </div>
          <div className="modal-action mt-6 pt-4 border-t border-base-300">
            {" "}
            {/* Added border for separation */}
            <button
              type="button"
              onClick={() => setIsSpecificTransferModalOpen(false)}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <FaTruckMoving className="mr-2" /> Submit Transfer Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SupervisorMachinesPage;
