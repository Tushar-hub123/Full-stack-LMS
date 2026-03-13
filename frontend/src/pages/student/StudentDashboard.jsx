import Books from "../Books";

export default function StudentDashboard({ user }) {
  return (
    <Books
      studentId={user.rollNo}
      studentName={user.name}
    />
  );
}