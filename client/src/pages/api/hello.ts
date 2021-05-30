export default (req: any, res: any) => {
  console.log(req)
  res.status(200).json({ name: 'John Doe' })
}
