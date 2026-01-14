import MeetupList from "../components/meetups/MeetupList";
import { MongoClient } from "mongodb";
import Head from "next/head";

// DUMMY DATA IS NO LONGER NEEDED, AS DATA IS NOW FETCHED FROM MONGODB

/* const DUMMY_MEETUPS = [
  {
    id: "m1",
    title: "A First Meetup",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/800px-Stadtbild_M%C3%BCnchen.jpg",
    address: "Some Place",
    description: "This is a first meetup",
  },

  {
    id: "m2",
    title: "A Second Meetup",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/800px-Stadtbild_M%C3%BCnchen.jpg",
    address: "Some Address",
    description: "This is a second meetup",
  },
]; */

function HomePage(props) {
  return (
    <>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups!"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
}

/* export async function getServerSideProps(context) {
  const req = context.req;
  const res = context.res;
  
  // fetch data from an API or database
  
  return {
    props: {
      meetups: DUMMY_MEETUPS,
    }
  };
}
*/

export async function getStaticProps() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    const meetupsCollection = db.collection("meetups");

    const meetups = await meetupsCollection.find().toArray();

    client.close();

    return {
      props: {
        meetups: meetups.map((meetup) => ({
          title: meetup.title,
          address: meetup.address,
          image: meetup.image,
          id: meetup._id.toString(),
        })),
      },
      revalidate: 1,
    };
  } catch (error) {
    console.error("Failed to fetch meetups:", error);

    // Fallback return to keep Next.js happy
    return {
      props: {
        meetups: [],
      },
      revalidate: 1,
    };
  }
}

export default HomePage;
