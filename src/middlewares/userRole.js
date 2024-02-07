import { ApiError } from "../utils/ApiError.js";

const customRole = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(new ApiError("You are not allowed for this resouce", 403));
      }
      console.log(req.user.role);
      next();
    };
  };

export {
  customRole
}