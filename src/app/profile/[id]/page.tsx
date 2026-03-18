import { redirect } from 'next/navigation';

export default function ProfileRedirect() {
  redirect('/homebase?view=profile');
}
