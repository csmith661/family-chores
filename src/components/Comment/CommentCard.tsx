import moment from "moment";
import Link from "next/link";
import UserImage from "../Video/UserImage";

export interface Comment {
  comment: {
    id: string;
    message: string;
    createdAt: Date;
  };
  user: {
    id: string;
    name: string | null;
    image: string | null;
    handle: string | null;
  };
}

const CommentCard = ({ user, comment }: Comment) => {
  return (
    <div className="mt-4 flex flex-row gap-4 border-t p-2 py-4 text-sm font-light">
      <Link href={`/${user.id}/ProfileVideos`}>
        <UserImage image={user?.image ?? ""} />
      </Link>
      <div>
        <div className="text-base font-semibold leading-6">
          <Link href={`/${user.id}/ProfileVideos`}>{user.handle}</Link>
          <div className="ml-4 inline font-light ">
            {moment(comment.createdAt).fromNow()}
          </div>
        </div>

        <div className="mt-2 whitespace-pre-line ">{comment.message}</div>
      </div>
    </div>
  );
};

export default CommentCard;
