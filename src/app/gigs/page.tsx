import { redirect } from 'next/navigation';

export default function GigsRedirect() {
  redirect('/homebase?view=gigs');
}
