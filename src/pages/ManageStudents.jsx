import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const emptyForm = {
	first_name: "",
	middle_name: "",
	last_name: "",
	age: "",
	phone_number: "",
};

function ManageStudents() {
	const [students, setStudents] = useState([]);
	const [form, setForm] = useState(emptyForm);
	const [editingId, setEditingId] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [user, setUser] = useState(null);
	const [authLoading, setAuthLoading] = useState(true);

	const loadStudents = async () => {
		setLoading(true);
		const { data, error } = await supabase
			.from("profile")
			.select("id, first_name, middle_name, last_name, age, phone_number")
			.order("last_name");

		if (error) {
			setErrorMessage(error.message);
		} else {
			setStudents(data ?? []);
		}
		setLoading(false);
	};

	useEffect(() => {
		const fetchStudents = async () => {
			const { data, error } = await supabase
				.from("profile")
				.select("id, first_name, middle_name, last_name, age, phone_number")
				.order("last_name");

			if (error) {
				setErrorMessage(error.message);
			} else {
				setStudents(data ?? []);
			}
			setLoading(false);
		};

		fetchStudents();
	}, []);

	useEffect(() => {
		const checkUser = async () => {
			const { data } = await supabase.auth.getUser();
			setUser(data.user);
			setAuthLoading(false);
		};

		checkUser();
	}, []);

	const handleChange = (event) => {
		setForm({ ...form, [event.target.name]: event.target.value });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setErrorMessage("");
		setIsSaving(true);
		const profile = {
			...form,
			age: form.age === "" ? null : Number(form.age),
			phone_number: form.phone_number === "" ? null : Number(form.phone_number),
		};

		const request = editingId
			? supabase.from("profile").update(profile).eq("id", editingId)
			: supabase.from("profile").insert(profile);
		const { error } = await request;

		if (error) {
			setErrorMessage(error.message);
		} else {
			setForm(emptyForm);
			setEditingId(null);
			await loadStudents();
		}
		setIsSaving(false);
	};

	const handleEdit = (student) => {
		setEditingId(student.id);
		setForm({
			first_name: student.first_name ?? "",
			middle_name: student.middle_name ?? "",
			last_name: student.last_name ?? "",
			age: student.age ?? "",
			phone_number: student.phone_number ?? "",
		});
		setErrorMessage("");
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Delete this student?")) return;

		const { error } = await supabase.from("profile").delete().eq("id", id);
		if (error) {
			setErrorMessage(error.message);
		} else {
			await loadStudents();
		}
	};

	const cancelEdit = () => {
		setEditingId(null);
		setForm(emptyForm);
		setErrorMessage("");
	};

	if (authLoading) {
		return <p>Loading...</p>;
	}

	if (!user) {
		return <Navigate to="/" replace />;
	}

	return (
		<div className="app-shell">
			<header className="topbar">
				<Link className="brand-mark" to="/Dashboard">NORTHSTAR <span>/ SMS</span></Link>
				<Link className="button button-quiet" to="/Dashboard">Back to dashboard</Link>
			</header>
			<main className="page-content directory-page">
				<div className="page-heading">
					<div>
						<p className="eyebrow">Directory</p>
						<h1>Manage students</h1>
						<p className="muted">Create, review, and update student profiles.</p>
					</div>
					<div className="record-count"><strong>{students.length}</strong><span>visible records</span></div>
				</div>

			<form className="student-form" onSubmit={handleSubmit}>
				<div className="form-heading"><div><p className="eyebrow">Profile details</p><h2>{editingId ? "Edit student" : "Add student"}</h2></div>{editingId && <span className="status-pill">Editing</span>}</div>
				<div className="form-grid">
					<label>First name<input name="first_name" placeholder="e.g. Amara" value={form.first_name} onChange={handleChange} required /></label>
					<label>Middle name<input name="middle_name" placeholder="Optional" value={form.middle_name} onChange={handleChange} /></label>
					<label>Last name<input name="last_name" placeholder="e.g. Okafor" value={form.last_name} onChange={handleChange} required /></label>
					<label>Age<input name="age" type="number" min="0" placeholder="Age" value={form.age} onChange={handleChange} /></label>
					<label>Phone number<input name="phone_number" type="tel" placeholder="Phone number" value={form.phone_number} onChange={handleChange} /></label>
				</div>
				<div className="form-actions"><button className="button button-primary" type="submit" disabled={isSaving}>
					{isSaving ? "Saving..." : editingId ? "Update student" : "Add student"}
				</button>{editingId && <button className="button button-secondary" type="button" onClick={cancelEdit}>Cancel</button>}</div>
			</form>

			{errorMessage && <p className="alert" role="alert">{errorMessage}</p>}
			{loading ? <p>Loading students...</p> : (
				<div className="table-wrap"><table>
					<thead>
						<tr><th>First name</th><th>Middle name</th><th>Last name</th><th>Age</th><th>Phone</th><th>Actions</th></tr>
					</thead>
					<tbody>
						{students.map((student) => (
							<tr key={student.id}>
								<td>{student.first_name}</td>
								<td>{student.middle_name}</td>
								<td>{student.last_name}</td>
								<td>{student.age}</td>
								<td>{student.phone_number}</td>
								<td>
									<button className="table-action" type="button" onClick={() => handleEdit(student)}>Edit</button>
									<button className="table-action table-action-danger" type="button" onClick={() => handleDelete(student.id)}>Delete</button>
								</td>
							</tr>
						))}
					</tbody>
				</table></div>
			)}
			</main>
		</div>
	);
}

export default ManageStudents;
