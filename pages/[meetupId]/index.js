import MeetupDetail from "../../components/meetups/MeetupDetail";
import { MongoClient, ObjectId } from "mongodb";
import Head from "next/head";

function MeetupDetails(props) {
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </>
  );
}

export async function getStaticPaths() {
  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();
    const meetupsCollection = db.collection("meetups");

    const meetups = await meetupsCollection
      .find({}, { projection: { _id: 1 } })
      .toArray();
    client.close();

    return {
      paths: meetups.map((meetup) => ({
        params: { meetupId: meetup._id.toString() },
      })),
      fallback: false,
    };
  } catch (error) {
    console.error("Failed to fetch meetups detail page:", error);
    return {
      paths: [],
      fallback: false,
    };
  }
}

export async function getStaticProps(context) {
  // fetch data for a single meetup

  try {
    const meetupId = context.params.meetupId;

    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db();

    const meetupsCollection = db.collection("meetups");

    const selectedMeetup = await meetupsCollection.findOne({
      _id: new ObjectId(meetupId),
    });

    client.close();

    selectedMeetup._id = selectedMeetup._id.toString();

    return {
      props: {
        meetupData: selectedMeetup,
      },
    };
  } catch (error) {
    console.error("Failed to fetch meetups detail page:", error);
    return { notFound: true };
  }
}

export default MeetupDetails;
