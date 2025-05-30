// src/pages/supervisor/SupervisorToolsPage.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaSearch,
  FaPlusCircle,
  FaWrench,
  FaUserTag,
  FaListUl,
  FaTrash,
  FaTasks,
} from "react-icons/fa";
import Modal from "../../components/common/Modal";

const SupervisorToolsPage = () => {
  const [searchParams] = useSearchParams();
  const initialAction = searchParams.get("action");

  const [tools, setTools] = useState([
    {
      id: "T001",
      name: "Hammer Set (10pc)",
      type: "Hand Tool",
      site: "Site A",
      quantity: 50,
      assignedQty: 20,
      reorderLevel: 10,
    },
    {
      id: "T002",
      name: "Bosch Impact Drill GSB500",
      type: "Power Tool",
      site: "Site B",
      quantity: 15,
      assignedQty: 10,
      reorderLevel: 5,
    },
    {
      id: "T003",
      name: "Spanner Kit (Metric)",
      type: "Hand Tool",
      site: "Site A",
      quantity: 30,
      assignedQty: 5,
      reorderLevel: 5,
    },
    {
      id: "T004",
      name: "Safety Helmets (Yellow)",
      type: "Safety Gear",
      site: "Central Store",
      quantity: 200,
      assignedQty: 75,
      reorderLevel: 50,
    },
    {
      id: "T005",
      name: "Welding Machine XM200",
      type: "Equipment",
      site: "Workshop",
      quantity: 5,
      assignedQty: 2,
      reorderLevel: 2,
    },
    {
      id: "T006",
      name: "Shovel - Round Point",
      type: "Hand Tool",
      site: "Site B",
      quantity: 40,
      assignedQty: 15,
      reorderLevel: 10,
    },
    {
      id: "T007",
      name: "Angle Grinder AG750",
      type: "Power Tool",
      site: "Workshop",
      quantity: 10,
      assignedQty: 0,
      reorderLevel: 3,
    },
    {
      id: "T008",
      name: "Safety Goggles (Clear)",
      type: "Safety Gear",
      site: "Central Store",
      quantity: 150,
      assignedQty: 20,
      reorderLevel: 30,
    },
  ]);

  const [filteredTools, setFilteredTools] = useState(tools);
  const [searchTerm, setSearchTerm] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // State for "Assign Specific Tool" Modal
  const [isAssignToolModalOpen, setIsAssignToolModalOpen] = useState(false);
  const [toolToAssign, setToolToAssign] = useState(null);
  const [assignToolFormData, setAssignToolFormData] = useState({
    assignee: "",
    quantityToAssign: 1,
    assignmentDate: new Date().toISOString().split("T")[0],
  });

  // State for "Assign Multiple Tools" Modal
  const [isAssignMultipleModalOpen, setIsAssignMultipleModalOpen] =
    useState(false);
  const [assignMultipleFormData, setAssignMultipleFormData] = useState({
    assignee: "",
    assignmentDate: new Date().toISOString().split("T")[0],
    toolsToAssign: [], // Array of objects: { toolId, name, type, quantity, maxAvailable, site }
  });
  const [availableToolsForMultiAssign, setAvailableToolsForMultiAssign] =
    useState([]);

  const mockLaborers = [
    { id: "L001", name: "John Doe (Laborer)" },
    { id: "L002", name: "Jane Smith (Laborer)" },
    { id: "S001", name: "ConstructCo (Subcontractor)" },
    { id: "L003", name: "Mike Brown (Laborer)" },
  ];

  useEffect(() => {
    // This effect handles opening a modal based on query parameters (e.g., from a quick link)
    if (initialAction === "assign" && tools.length > 0) {
      // For a generic "assign tools" quick link, we'll open the "Assign Multiple Tools" modal
      console.log(
        "Initial action 'assign': opening Assign Multiple Tools modal."
      );
      openAssignMultipleToolsModal();
      // Note: If a specific tool ID was passed, we could open the specific tool assign modal.
      // For now, generic "assign tool" action from dashboard opens multi-assign.
    }
  }, [initialAction, tools]); // `tools` dependency in case it loads async later

  useEffect(() => {
    let currentTools = [...tools];
    if (searchTerm) {
      currentTools = currentTools.filter(
        (t) =>
          t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (siteFilter)
      currentTools = currentTools.filter((t) => t.site === siteFilter);
    if (typeFilter)
      currentTools = currentTools.filter((t) => t.type === typeFilter);
    setFilteredTools(currentTools);
  }, [searchTerm, siteFilter, typeFilter, tools]);

  useEffect(() => {
    setAvailableToolsForMultiAssign(
      tools.map((t) => ({ ...t, available: t.quantity - t.assignedQty }))
      // No filter for t.available > 0 here, so all tools are listed.
      // The "Add" button will be disabled if tool.available <= 0.
    );
  }, [tools]);

  // --- Assign Specific Tool Modal Logic ---
  const handleOpenAssignToolModal = (tool) => {
    setToolToAssign(tool);
    setAssignToolFormData({
      assignee: "",
      quantityToAssign: 1,
      assignmentDate: new Date().toISOString().split("T")[0],
    });
    setIsAssignToolModalOpen(true);
  };

  const handleAssignToolModalInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    if (name === "quantityToAssign") {
      const currentToolMaxAvailable = toolToAssign
        ? toolToAssign.quantity - toolToAssign.assignedQty
        : 1;
      if (value === "") {
        processedValue = "";
      } else {
        const numVal = parseInt(value, 10);
        if (!isNaN(numVal)) {
          processedValue = Math.max(
            1,
            Math.min(numVal, currentToolMaxAvailable)
          );
        } else {
          processedValue = assignToolFormData.quantityToAssign; // Revert if invalid
        }
      }
    }
    setAssignToolFormData((prev) => ({ ...prev, [name]: processedValue }));
  };

  const handleSubmitToolAssignment = (e) => {
    e.preventDefault();
    const quantityNum = parseInt(assignToolFormData.quantityToAssign, 10);
    if (!toolToAssign || isNaN(quantityNum) || quantityNum <= 0) {
      alert("Invalid quantity to assign.");
      return;
    }
    const availableQty = toolToAssign.quantity - toolToAssign.assignedQty;
    if (quantityNum > availableQty) {
      alert(`Cannot assign more than available quantity (${availableQty}).`);
      return;
    }
    console.log(
      "Assigning Tool:",
      toolToAssign.id,
      "Quantity:",
      quantityNum,
      "To:",
      assignToolFormData.assignee,
      "Date:",
      assignToolFormData.assignmentDate
    );
    alert(
      `Assigned ${quantityNum} of ${toolToAssign.name} to ${assignToolFormData.assignee}.`
    );
    setTools((prevTools) =>
      prevTools.map((t) =>
        t.id === toolToAssign.id
          ? { ...t, assignedQty: t.assignedQty + quantityNum }
          : t
      )
    );
    setIsAssignToolModalOpen(false);
    setToolToAssign(null);
  };

  // --- Assign Multiple Tools Modal Logic ---
  const openAssignMultipleToolsModal = () => {
    setAssignMultipleFormData({
      assignee: "",
      assignmentDate: new Date().toISOString().split("T")[0],
      toolsToAssign: [],
    });
    setIsAssignMultipleModalOpen(true);
  };

  const handleAssignMultipleFormChange = (e) => {
    const { name, value } = e.target;
    setAssignMultipleFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddToolToMultiAssign = (toolId) => {
    const tool = availableToolsForMultiAssign.find((t) => t.id === toolId);
    if (
      tool &&
      tool.available > 0 &&
      !assignMultipleFormData.toolsToAssign.some((t) => t.toolId === tool.id)
    ) {
      setAssignMultipleFormData((prev) => ({
        ...prev,
        toolsToAssign: [
          ...prev.toolsToAssign,
          {
            toolId: tool.id,
            name: tool.name,
            type: tool.type,
            site: tool.site,
            quantity: 1,
            maxAvailable: tool.available,
          },
        ],
      }));
    } else if (tool && tool.available <= 0) {
      alert(`${tool.name} is not available for assignment.`);
    }
  };

  const handleRemoveToolFromMultiAssign = (toolId) => {
    setAssignMultipleFormData((prev) => ({
      ...prev,
      toolsToAssign: prev.toolsToAssign.filter((t) => t.toolId !== toolId),
    }));
  };

  const handleMultiAssignToolQuantityChange = (toolId, newQuantityStr) => {
    setAssignMultipleFormData((prev) => ({
      ...prev,
      toolsToAssign: prev.toolsToAssign.map((t) => {
        if (t.toolId === toolId) {
          if (newQuantityStr === "") return { ...t, quantity: "" };
          const numQuantity = parseInt(newQuantityStr, 10);
          if (!isNaN(numQuantity)) {
            const validatedQuantity = Math.max(
              1,
              Math.min(numQuantity, t.maxAvailable)
            );
            return { ...t, quantity: validatedQuantity };
          }
          return { ...t, quantity: t.quantity }; // Revert if invalid
        }
        return t;
      }),
    }));
  };

  const handleSubmitMultipleToolsAssignment = (e) => {
    e.preventDefault();
    if (!assignMultipleFormData.assignee) {
      alert("Please select an assignee.");
      return;
    }
    if (assignMultipleFormData.toolsToAssign.length === 0) {
      alert("Please add at least one tool to assign.");
      return;
    }

    const validToolsToAssign = [];
    for (const item of assignMultipleFormData.toolsToAssign) {
      const quantityNum = parseInt(item.quantity, 10);
      if (
        isNaN(quantityNum) ||
        quantityNum < 1 ||
        quantityNum > item.maxAvailable
      ) {
        alert(
          `Please enter a valid quantity (1-${item.maxAvailable}) for ${item.name}. You entered: "${item.quantity}"`
        );
        return;
      }
      validToolsToAssign.push({ ...item, quantity: quantityNum });
    }

    console.log("Assigning Multiple Tools (validated):", {
      ...assignMultipleFormData,
      toolsToAssign: validToolsToAssign,
    });
    alert(
      `Assigned ${validToolsToAssign.length} tool type(s) to ${assignMultipleFormData.assignee}.`
    );

    let updatedToolsState = [...tools];
    validToolsToAssign.forEach((assignedTool) => {
      updatedToolsState = updatedToolsState.map((mainTool) => {
        if (mainTool.id === assignedTool.toolId) {
          return {
            ...mainTool,
            assignedQty: mainTool.assignedQty + assignedTool.quantity,
          };
        }
        return mainTool;
      });
    });
    setTools(updatedToolsState);

    setIsAssignMultipleModalOpen(false);
    setAssignMultipleFormData({
      assignee: "",
      assignmentDate: new Date().toISOString().split("T")[0],
      toolsToAssign: [],
    });
  };

  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="card-title text-2xl text-primary mb-4 sm:mb-0">
              Tool Management (Supervisor)
            </h2>
            <button
              className="btn btn-primary btn-sm sm:btn-md"
              onClick={openAssignMultipleToolsModal}
            >
              <FaListUl className="mr-2" /> Assign Multiple Tools
            </button>
          </div>

          {/* Filters Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-4 bg-base-200 rounded-lg">
            <div className="form-control">
              <label className="label pb-1 pt-0">
                <span className="label-text">Search Tool</span>
              </label>
              <div className="join w-full">
                <input
                  type="text"
                  placeholder="ID, Name..."
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
                <option value="">All Sites</option>{" "}
                <option value="Site A">Site A</option>{" "}
                <option value="Site B">Site B</option>{" "}
                <option value="Site C">Site C</option>{" "}
                <option value="Central Store">Central Store</option>{" "}
                <option value="Workshop">Workshop</option>
              </select>
            </div>
            <div className="form-control">
              <label className="label pb-1 pt-0">
                <span className="label-text">Filter by Type</span>
              </label>
              <select
                className="select select-bordered w-full focus:border-primary"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>{" "}
                <option value="Hand Tool">Hand Tool</option>{" "}
                <option value="Power Tool">Power Tool</option>{" "}
                <option value="Safety Gear">Safety Gear</option>{" "}
                <option value="Equipment">Equipment</option>
              </select>
            </div>
          </div>

          {/* Tools Table */}
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name / Type</th>
                  <th>Site</th>
                  <th className="text-right">Total Qty</th>
                  <th className="text-right">Assigned Qty</th>
                  <th className="text-right">Available Qty</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTools.length > 0 ? (
                  filteredTools.map((tool) => {
                    const availableQty = tool.quantity - tool.assignedQty;
                    return (
                      <tr key={tool.id} className="hover">
                        <td className="font-semibold text-primary">
                          {tool.id}
                        </td>
                        <td>
                          <div>{tool.name}</div>
                          <div className="text-xs opacity-70">{tool.type}</div>
                        </td>
                        <td>{tool.site}</td>
                        <td className="text-right">{tool.quantity}</td>
                        <td className="text-right">{tool.assignedQty}</td>
                        <td
                          className={`text-right font-medium ${
                            availableQty <= 0 ? "text-error" : "text-success"
                          }`}
                        >
                          {availableQty}
                        </td>
                        <td className="whitespace-nowrap">
                          <button
                            className="btn btn-xs btn-outline btn-info disabled:opacity-50"
                            onClick={() => handleOpenAssignToolModal(tool)}
                            disabled={availableQty <= 0}
                            title="Assign Tool"
                          >
                            <FaUserTag /> Assign
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center p-4">
                      No tools found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>{" "}
        {/* End of card-body */}
      </div>{" "}
      {/* End of card */}
      {/* Assign Specific Tool Modal */}
      <Modal
        isOpen={isAssignToolModalOpen}
        onClose={() => setIsAssignToolModalOpen(false)}
        title={`Assign Tool: ${toolToAssign?.name || ""}`}
      >
        <form onSubmit={handleSubmitToolAssignment} className="space-y-4">
          {toolToAssign && (
            <div className="p-3 bg-base-200 rounded-md text-sm space-y-1">
              {" "}
              <p>
                <strong>Tool ID:</strong>{" "}
                <span className="font-mono">{toolToAssign.id}</span>
              </p>{" "}
              <p>
                <strong>Type:</strong> {toolToAssign.type}
              </p>{" "}
              <p>
                <strong>Site:</strong> {toolToAssign.site}
              </p>{" "}
              <p>
                <strong>Currently Available:</strong>{" "}
                <span className="font-semibold">
                  {toolToAssign.quantity - toolToAssign.assignedQty}
                </span>
              </p>{" "}
            </div>
          )}
          <div className="form-control">
            {" "}
            <label className="label">
              <span className="label-text">Assign To</span>
            </label>{" "}
            <select
              name="assignee"
              value={assignToolFormData.assignee}
              onChange={handleAssignToolModalInputChange}
              className="select select-bordered w-full focus:border-primary"
              required
            >
              {" "}
              <option value="" disabled>
                Select assignee...
              </option>{" "}
              {mockLaborers.map((l) => (
                <option key={l.id} value={l.name}>
                  {l.name}
                </option>
              ))}{" "}
            </select>{" "}
          </div>
          <div className="form-control">
            {" "}
            <label className="label">
              <span className="label-text">Quantity to Assign</span>
            </label>{" "}
            <input
              type="number"
              name="quantityToAssign"
              value={assignToolFormData.quantityToAssign}
              onChange={handleAssignToolModalInputChange}
              className="input input-bordered w-full focus:border-primary"
              min="1"
              max={
                toolToAssign
                  ? toolToAssign.quantity - toolToAssign.assignedQty
                  : 1
              }
              required
            />{" "}
          </div>
          <div className="form-control">
            {" "}
            <label className="label">
              <span className="label-text">Assignment Date</span>
            </label>{" "}
            <input
              type="date"
              name="assignmentDate"
              value={assignToolFormData.assignmentDate}
              onChange={handleAssignToolModalInputChange}
              className="input input-bordered w-full focus:border-primary"
              required
            />{" "}
          </div>
          <div className="modal-action mt-6 pt-4 border-t border-base-300">
            {" "}
            <button
              type="button"
              onClick={() => setIsAssignToolModalOpen(false)}
              className="btn btn-ghost"
            >
              Cancel
            </button>{" "}
            <button type="submit" className="btn btn-primary">
              {" "}
              <FaUserTag className="mr-2" /> Confirm Assignment{" "}
            </button>{" "}
          </div>
        </form>
      </Modal>
      {/* Assign Multiple Tools Modal */}
      <Modal
        isOpen={isAssignMultipleModalOpen}
        onClose={() => setIsAssignMultipleModalOpen(false)}
        title="Assign Multiple Tools"
        size="max-w-3xl" // Using a larger modal
      >
        <form
          onSubmit={handleSubmitMultipleToolsAssignment}
          className="space-y-4"
        >
          {/* Assignee and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Assign To <span className="text-error">*</span>
                </span>
              </label>
              <select
                name="assignee"
                value={assignMultipleFormData.assignee}
                onChange={handleAssignMultipleFormChange}
                className="select select-bordered w-full focus:border-primary"
                required
              >
                <option value="" disabled>
                  Select assignee...
                </option>
                {mockLaborers.map((l) => (
                  <option key={l.id} value={l.name}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">
                  Assignment Date <span className="text-error">*</span>
                </span>
              </label>
              <input
                type="date"
                name="assignmentDate"
                value={assignMultipleFormData.assignmentDate}
                onChange={handleAssignMultipleFormChange}
                className="input input-bordered w-full focus:border-primary"
                required
              />
            </div>
          </div>

          {/* Available Tools Selection List */}
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text font-medium">
                Available Tools for Assignment:
              </span>
            </label>
            <div className="p-2 border border-base-300 rounded-md max-h-48 overflow-y-auto bg-base-200 space-y-1">
              {availableToolsForMultiAssign.length > 0 ? (
                availableToolsForMultiAssign.map((tool) => (
                  <div
                    key={`available-${tool.id}`}
                    className="flex items-center justify-between p-2 rounded hover:bg-base-300/50 text-sm"
                  >
                    <div>
                      <span className="font-medium">{tool.name}</span>{" "}
                      <span className="text-xs opacity-70">({tool.type})</span>
                      <span className="text-xs block opacity-70">
                        {" "}
                        Site: {tool.site}, Avail: {tool.available}{" "}
                      </span>
                    </div>
                    {!assignMultipleFormData.toolsToAssign.some(
                      (t) => t.toolId === tool.id
                    ) ? (
                      <button
                        type="button"
                        onClick={() => handleAddToolToMultiAssign(tool.id)}
                        className="btn btn-xs btn-outline btn-accent py-1 px-2"
                        disabled={tool.available <= 0}
                      >
                        {" "}
                        Add{" "}
                      </button>
                    ) : (
                      <span className="badge badge-success badge-sm py-2">
                        {" "}
                        Selected{" "}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-base-content/70 p-2 col-span-full text-center">
                  {" "}
                  No tools currently available or all selected.{" "}
                </p>
              )}
            </div>
          </div>

          {/* Selected Tools for Assignment List */}
          {assignMultipleFormData.toolsToAssign.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-md font-semibold text-primary border-b border-base-300 pb-1 mb-2">
                {" "}
                Selected Tools for Assignment:{" "}
              </h4>
              {assignMultipleFormData.toolsToAssign.map((item) => (
                <div
                  key={`selected-${item.toolId}`}
                  className="grid grid-cols-12 gap-x-2 gap-y-1 items-center p-2 bg-base-200/50 rounded-md"
                >
                  <div className="col-span-12 sm:col-span-6">
                    <p
                      className="text-sm font-medium truncate"
                      title={item.name}
                    >
                      {" "}
                      {item.name}{" "}
                    </p>
                    <p className="text-xs text-base-content/70">
                      {" "}
                      {item.type} (Site: {item.site}, Max: {item.maxAvailable}){" "}
                    </p>
                  </div>
                  <div className="col-span-8 sm:col-span-4 form-control">
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) =>
                        handleMultiAssignToolQuantityChange(
                          item.toolId,
                          e.target.value
                        )
                      }
                      className="input input-sm input-bordered w-full focus:border-primary"
                      min="1"
                      max={item.maxAvailable}
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveToolFromMultiAssign(item.toolId)
                      }
                      className="btn btn-xs btn-ghost text-error p-1"
                      title="Remove Tool"
                    >
                      {" "}
                      <FaTrash />{" "}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal Actions */}
          <div className="modal-action mt-6 pt-4 border-t border-base-300">
            <button
              type="button"
              onClick={() => setIsAssignMultipleModalOpen(false)}
              className="btn btn-ghost"
            >
              {" "}
              Cancel{" "}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                assignMultipleFormData.toolsToAssign.length === 0 ||
                !assignMultipleFormData.assignee
              }
            >
              <FaTasks className="mr-2" /> Confirm Assignments
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SupervisorToolsPage;
